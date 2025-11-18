import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { idea, options } = body;

		if (!idea || !idea.trim()) {
			return NextResponse.json({ error: "Idea is required" }, { status: 400 });
		}

		// Use HuggingFace API
		const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";

		if (!HF_API_TOKEN) {
			return NextResponse.json({
				prompt: generateIntelligentFallback(idea, options),
				note: "Please add HUGGINGFACE_API_TOKEN to your .env.local file. Get your token at https://huggingface.co/settings/tokens",
			});
		}

		try {
			// Use standard HuggingFace Inference API
			const model = "gpt2";
			const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

			// Simple prompt format
			const textPrompt = `Create a professional AI prompt: ${idea}\n\nPrompt:`;

			const requestBody = {
				inputs: textPrompt,
				parameters: {
					max_new_tokens: 400,
					temperature: 0.8,
					return_full_text: false,
				},
			};

			const hfResponse = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${HF_API_TOKEN}`,
				},
				body: JSON.stringify(requestBody),
			});

			if (!hfResponse.ok) {
				return NextResponse.json({
					prompt: generateIntelligentFallback(idea, options),
				});
			}

			const hfData = await hfResponse.json();

			let generatedText = "";

			// Standard format: { generated_text: "..." } or [{ generated_text: "..." }]
			if (Array.isArray(hfData) && hfData[0]?.generated_text) {
				generatedText = hfData[0].generated_text;
			} else if (hfData.generated_text) {
				generatedText = hfData.generated_text;
			}

			if (!generatedText) {
				return NextResponse.json({
					prompt: generateIntelligentFallback(idea, options),
				});
			}

			// Clean up the generated text
			generatedText = generatedText.trim();

			// Remove any special tokens
			generatedText = generatedText.replace(/<\|endoftext\|>/g, "");
			generatedText = generatedText.replace(/<pad>/g, "");
			generatedText = generatedText.trim();

			// Remove prompt echo if present
			if (generatedText.includes("Prompt:")) {
				const parts = generatedText.split("Prompt:");
				if (parts[1]) {
					generatedText = parts[1].trim();
				}
			}

			if (generatedText.length < 50) {
				return NextResponse.json({
					prompt: generateIntelligentFallback(idea, options),
				});
			}

			return NextResponse.json({
				prompt: generatedText,
			});
		} catch (error) {
			return NextResponse.json({
				prompt: generateIntelligentFallback(idea, options),
			});
		}
	} catch (error) {
		console.error("Error generating prompt:", error);
		return NextResponse.json(
			{
				error: "Failed to generate prompt",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// Enhanced fallback that creates professional, well-structured prompts
function generateIntelligentFallback(idea: string, options: any): string {
	let prompt = "";

	// Analyze the idea and create a more intelligent prompt
	const ideaLower = idea.toLowerCase();
	const isCodeRelated =
		ideaLower.includes("code") ||
		ideaLower.includes("programming") ||
		ideaLower.includes("react") ||
		ideaLower.includes("vue") ||
		ideaLower.includes("javascript") ||
		ideaLower.includes("python") ||
		ideaLower.includes("app") ||
		ideaLower.includes("todo");
	const isWritingRelated =
		ideaLower.includes("write") ||
		ideaLower.includes("essay") ||
		ideaLower.includes("article") ||
		ideaLower.includes("story") ||
		ideaLower.includes("content") ||
		ideaLower.includes("blog");
	const isAnalysisRelated =
		ideaLower.includes("analyze") ||
		ideaLower.includes("explain") ||
		ideaLower.includes("review") ||
		ideaLower.includes("understand") ||
		ideaLower.includes("breakdown");
	const isPlanningRelated =
		ideaLower.includes("plan") ||
		ideaLower.includes("schedule") ||
		ideaLower.includes("organize") ||
		ideaLower.includes("manage");
	const isCreativeRelated =
		ideaLower.includes("creative") ||
		ideaLower.includes("design") ||
		ideaLower.includes("art") ||
		ideaLower.includes("generate");

	if (options.includeRole) {
		if (isCodeRelated) {
			prompt += `You are an expert software engineer and technical consultant with deep knowledge of best practices, design patterns, modern development frameworks, and software architecture. You excel at writing clean, maintainable code and providing actionable technical guidance.\n\n`;
		} else if (isWritingRelated) {
			prompt += `You are a professional writer and editor with expertise in crafting clear, engaging, and well-structured content across various formats and audiences. You have a keen eye for detail and a mastery of language and style.\n\n`;
		} else if (isAnalysisRelated) {
			prompt += `You are an expert analyst with strong critical thinking skills and the ability to break down complex topics into clear, understandable insights. You excel at identifying patterns, drawing connections, and presenting information in a logical and accessible manner.\n\n`;
		} else if (isPlanningRelated) {
			prompt += `You are a strategic planner and organizer with expertise in project management, systematic thinking, and efficient workflow design. You excel at breaking down goals into actionable steps and creating clear, achievable plans.\n\n`;
		} else if (isCreativeRelated) {
			prompt += `You are a creative professional with expertise in design thinking, innovation, and artistic expression. You excel at generating original ideas and bringing creative visions to life.\n\n`;
		} else {
			prompt += `You are an expert AI assistant designed to help users achieve their goals effectively and safely. You combine knowledge, empathy, and practicality to provide valuable assistance across a wide range of tasks and challenges.\n\n`;
		}
	}

	prompt += `Your Task:\n${idea}\n\n`;

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
		prompt += `Guidelines for Examples:\n- Include concrete, relevant examples that illustrate key concepts or approaches\n- Use examples that are practical and easy to understand\n- Provide multiple examples when helpful to show different scenarios or use cases\n- Ensure examples are directly related to the task at hand\n\n`;
	}

	prompt += `Additional Instructions:\n- Provide clear, actionable responses that directly address the task\n- Break down complex information into digestible parts when necessary\n- Be thorough and comprehensive while remaining concise\n- Focus on delivering practical, useful outcomes\n- Ensure your response is well-organized and easy to follow\n\nPlease proceed with the task as described above, ensuring high quality and thoroughness in your response.`;

	return prompt;
}
