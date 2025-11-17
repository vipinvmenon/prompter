import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { idea, options } = await request.json();

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: 'Idea is required' },
        { status: 400 }
      );
    }

    // Debug: Log environment variable status
    console.log('=== Environment Check ===');
    console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
    console.log('HUGGINGFACE_API_TOKEN present:', !!process.env.HUGGINGFACE_API_TOKEN);
    console.log('Token starts with hf_:', process.env.HUGGINGFACE_API_TOKEN?.startsWith('hf_') || false);

    // Build the prompt for AI
    let instructionPrompt = `Transform this user idea into a well-crafted, professional AI prompt. The user's idea: "${idea}"

Create a comprehensive AI prompt that includes:`;

    if (options.includeRole) {
      instructionPrompt += '\n- A clear role definition for the AI';
    }
    if (options.includeTone) {
      instructionPrompt += '\n- Appropriate tone and style guidelines';
    }
    if (options.includeSafetyRules) {
      instructionPrompt += '\n- Safety and ethical guidelines';
    }
    if (options.includeExamples) {
      instructionPrompt += '\n- Concrete examples when relevant';
    }

    instructionPrompt += `\n\nReturn only the crafted prompt, nothing else. Make it professional, detailed, and actionable.`;

    // Try Groq first (free, fast, no token required for basic usage)
    const groqApiKey = process.env.GROQ_API_KEY || '';
    
    // If Groq API key exists, use it
    if (groqApiKey) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: 'You are an expert AI prompt engineer. Transform user ideas into well-crafted, professional AI prompts.',
              },
              {
                role: 'user',
                content: instructionPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 512,
          }),
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const generatedText = groqData.choices?.[0]?.message?.content?.trim();    
          
          if (generatedText) {
            return NextResponse.json({ prompt: generatedText });
          }
        }
      } catch (error) {
        console.log('Groq API error, trying alternatives:', error);
      }
    }

    // Try Hugging Face with token (if available)
    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '';
    
    // Debug: Check if token is present (don't log the actual token)
    console.log('HF Token present:', HF_API_TOKEN ? 'YES' : 'NO');
    
    if (HF_API_TOKEN) {
      try {
        // Use a good model that works with tokens
        const model = 'mistralai/Mistral-7B-Instruct-v0.2';
        const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
        const chatPrompt = `<s>[INST] ${instructionPrompt} [/INST]`;

        console.log('Calling Hugging Face API with model:', model);
        const hfResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HF_API_TOKEN}`,
          },
          body: JSON.stringify({
            inputs: chatPrompt,
            parameters: {
              max_new_tokens: 512,
              temperature: 0.7,
              top_p: 0.9,
              return_full_text: false,
            },
          }),
        });

        console.log('HF Response status:', hfResponse.status, hfResponse.ok);
        
        if (hfResponse.ok) {
          const hfData = await hfResponse.json();
          console.log('HF Response data keys:', Object.keys(hfData));
          console.log('HF Response data (first 500 chars):', JSON.stringify(hfData).substring(0, 500));
          
          let generatedText = '';
          
          if (Array.isArray(hfData) && hfData[0]?.generated_text) {
            generatedText = hfData[0].generated_text;
          } else if (hfData.generated_text) {
            generatedText = hfData.generated_text;
          }
          
          console.log('Extracted generated text length:', generatedText.length);
          
          if (generatedText) {
            // Clean up the text
            generatedText = generatedText.trim();
            if (generatedText.includes('[/INST]')) {
              generatedText = generatedText.split('[/INST]').pop()?.trim() || generatedText;
            }
            if (generatedText.includes('<s>')) {
              generatedText = generatedText.replace(/<s>/g, '').trim();
            }
            if (generatedText.includes('[INST]')) {
              generatedText = generatedText.replace(/\[INST\]/g, '').trim();
            }
            
            // Remove the original instruction prompt if it's included
            if (generatedText.includes(instructionPrompt.substring(0, 50))) {
              const promptStart = generatedText.indexOf(instructionPrompt);
              if (promptStart !== -1) {
                generatedText = generatedText.substring(promptStart + instructionPrompt.length).trim();
              }
            }
            
            console.log('Final cleaned text length:', generatedText.length);
            
            if (generatedText.length > 20) {
              console.log('✅ Returning AI-generated prompt');
              return NextResponse.json({ prompt: generatedText });
            } else {
              console.log('⚠️ Generated text too short, falling through');
            }
          } else {
            console.log('⚠️ No generated text found in response');
          }
        } else {
          // Log the error for debugging
          const errorText = await hfResponse.text().catch(() => 'Unknown error');
          console.error('Hugging Face API error - Status:', hfResponse.status);
          console.error('Hugging Face API error - Response:', errorText.substring(0, 200));
          
          // If model is loading (503), inform user
          if (hfResponse.status === 503) {
            try {
              const errorData = JSON.parse(errorText);
              console.log('Model loading info:', errorData);
            } catch (e) {
              // Ignore parse errors
            }
            return NextResponse.json({
              prompt: generateIntelligentFallback(idea, options),
              note: 'Model is currently loading. Please try again in 10-20 seconds. Using template-based generation in the meantime.'
            });
          }
        }
      } catch (error) {
        console.error('Hugging Face API exception:', error);
        // Continue to try free models or fallback
      }
    } else {
      console.log('No HUGGINGFACE_API_TOKEN found in environment variables');
      console.log('Make sure .env.local is in the prompter folder (same level as package.json)');
    }

    // Try free Hugging Face models that work without tokens
    const freeModels = [
      'gpt2',
      'distilgpt2',
    ];

    for (const model of freeModels) {
      try {
        const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
        
        // For GPT-2 models, we need to format the prompt differently
        const promptForModel = `Transform this into a professional AI prompt: "${idea}". Requirements: ${options.includeRole ? 'include role' : ''} ${options.includeTone ? 'include tone' : ''} ${options.includeSafetyRules ? 'include safety rules' : ''} ${options.includeExamples ? 'include examples' : ''}. Create the prompt:`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: promptForModel,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.8,
              top_p: 0.95,
              return_full_text: false,
            },
          }),
        });

        // If model is loading (503), wait a bit and continue to next model
        if (response.status === 503) {
          console.log(`Model ${model} is loading, trying next...`);
          continue;
        }

        if (response.ok) {
          const data = await response.json();
          let generatedText = '';
          
          if (Array.isArray(data) && data[0]?.generated_text) {
            generatedText = data[0].generated_text;
          } else if (data.generated_text) {
            generatedText = data.generated_text;
          }
          
          if (generatedText && generatedText.trim().length > 50) {
            // Clean up
            generatedText = generatedText.trim();
            // Remove the original prompt if included
            if (generatedText.startsWith(promptForModel)) {
              generatedText = generatedText.substring(promptForModel.length).trim();
            }
            
            // If we got something reasonable, return it
            if (generatedText.length > 30) {
              return NextResponse.json({ prompt: generatedText });
            }
          }
        }
      } catch (error) {
        console.log(`Error with model ${model}:`, error);
        continue;
      }
    }

    // If all AI attempts failed, use intelligent template-based generation
    // This is better than nothing but we should inform the user
    const fallbackPrompt = generateIntelligentFallback(idea, options);
    
    return NextResponse.json({ 
      prompt: fallbackPrompt,
      note: 'Using template-based generation. For AI-powered prompts, add GROQ_API_KEY or HUGGINGFACE_API_TOKEN to your .env.local file. Get Groq key free at https://console.groq.com or HF token at https://huggingface.co/settings/tokens'
    });

  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Improved fallback that at least structures the prompt better
function generateIntelligentFallback(idea: string, options: any): string {
  let prompt = '';

  // Analyze the idea and create a more intelligent prompt
  const ideaLower = idea.toLowerCase();
  const isCodeRelated = ideaLower.includes('code') || ideaLower.includes('programming') || ideaLower.includes('react') || ideaLower.includes('javascript');
  const isWritingRelated = ideaLower.includes('write') || ideaLower.includes('essay') || ideaLower.includes('article') || ideaLower.includes('story');
  const isAnalysisRelated = ideaLower.includes('analyze') || ideaLower.includes('explain') || ideaLower.includes('review');
  const isPlanningRelated = ideaLower.includes('plan') || ideaLower.includes('schedule') || ideaLower.includes('organize');

  if (options.includeRole) {
    if (isCodeRelated) {
      prompt += `You are an expert software engineer and code reviewer with deep knowledge of best practices, design patterns, and modern development frameworks.\n\n`;
    } else if (isWritingRelated) {
      prompt += `You are a professional writer and editor with expertise in crafting clear, engaging, and well-structured content.\n\n`;
    } else if (isAnalysisRelated) {
      prompt += `You are an expert analyst with strong critical thinking skills and the ability to break down complex topics into clear, understandable insights.\n\n`;
    } else if (isPlanningRelated) {
      prompt += `You are a strategic planner and organizer with expertise in project management and systematic thinking.\n\n`;
    } else {
      prompt += `You are an expert AI assistant designed to help users achieve their goals effectively and safely.\n\n`;
    }
  }

  prompt += `Task: ${idea}\n\n`;

  if (options.includeTone) {
    if (isCodeRelated) {
      prompt += `Tone and Style: Use a technical but approachable tone. Be precise with terminology, provide clear explanations, and use code examples when helpful. Explain concepts in a way that balances depth with accessibility.\n\n`;
    } else if (isWritingRelated) {
      prompt += `Tone and Style: Write in a clear, engaging, and professional manner. Adapt your writing style to match the intended audience and purpose. Use appropriate vocabulary and maintain consistency throughout.\n\n`;
    } else {
      prompt += `Tone: Please respond in a professional, clear, and helpful manner. Adapt your communication style to be appropriate for the context and user needs.\n\n`;
    }
  }

  if (options.includeSafetyRules) {
    prompt += `Safety Guidelines:\n- Ensure all responses are accurate, ethical, and safe\n- Do not provide harmful, offensive, or inappropriate content\n- Respect user privacy and data security\n- Provide disclaimers when necessary for safety or legal reasons\n- Verify information when dealing with critical topics\n\n`;
  }

  if (options.includeExamples) {
    prompt += `Instructions: Provide clear, actionable responses. When relevant, include concrete examples to illustrate key points and help clarify complex concepts.\n\n`;
  }

  prompt += `Please proceed with the task as described above, ensuring high quality and thoroughness in your response.`;

  return prompt;
}
