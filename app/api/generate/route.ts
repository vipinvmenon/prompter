import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { idea, options, mode } = body;

		if (!idea || !idea.trim()) {
			return NextResponse.json({ error: "Idea is required" }, { status: 400 });
		}

		// Try different AI providers in order
		const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
		const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "";

		// Build the system prompt based on options and mode
		const systemPrompt = buildSystemPrompt(options, mode);
		const userPrompt = buildUserPrompt(idea, mode);

		// Try Groq first (best free option)
		if (GROQ_API_KEY) {
			try {
				const groqResult = await tryGroq(
					GROQ_API_KEY,
					systemPrompt,
					userPrompt
				);
				if (groqResult) {
					return NextResponse.json({
						prompt: groqResult.prompt,
						model: groqResult.model,
						provider: "Groq",
					});
				}
			} catch (error) {
				// Silently try next provider
			}
		}

		// Try HuggingFace with better models
		if (HF_API_TOKEN) {
			try {
				const hfResult = await tryHuggingFace(
					HF_API_TOKEN,
					systemPrompt,
					userPrompt
				);
				if (hfResult) {
					return NextResponse.json({
						prompt: hfResult.prompt,
						model: hfResult.model,
						provider: "HuggingFace",
					});
				}
			} catch (error) {
				// Silently try fallback
			}
		}

		// Fallback to template-based generation
		const fallbackPrompt = generateIntelligentFallback(idea, options, mode);
		return NextResponse.json({
			prompt: fallbackPrompt,
			model: "Template Fallback",
			provider: "Local",
			note:
				!GROQ_API_KEY && !HF_API_TOKEN
					? "⚠️ No API keys configured. Get a free API key:\n• Groq (fastest): https://console.groq.com\n• HuggingFace: https://huggingface.co/settings/tokens\n\nAdd GROQ_API_KEY or HUGGINGFACE_API_TOKEN to your .env.local file."
					: "Using fallback template. For better results, check your API keys.",
		});
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

// Try Groq API with multiple models (try newer models first)
async function tryGroq(
	apiKey: string,
	systemPrompt: string,
	userPrompt: string
): Promise<{ prompt: string; model: string } | null> {
	// List of available Groq models (as of Nov 2024+)
	const models = [
		"llama-3.3-70b-versatile", // Latest Llama 3.3 70B (best quality)
		"llama-3.1-8b-instant", // Fast Llama 3.1 8B
		"mixtral-8x7b-32768", // Mixtral (good fallback)
		"gemma2-9b-it", // Gemma 2 (another fallback)
	];

	for (const model of models) {
		try {
			const response = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						model: model,
						messages: [
							{ role: "system", content: systemPrompt },
							{ role: "user", content: userPrompt },
						],
						temperature: 0.7,
						max_tokens: 1000,
					}),
				}
			);

			if (!response.ok) continue;

			const data = await response.json();
			const generatedPrompt = data.choices?.[0]?.message?.content?.trim();

			if (generatedPrompt && generatedPrompt.length > 50) {
				return { prompt: generatedPrompt, model: model };
			}
		} catch (error) {
			continue;
		}
	}

	return null;
}

// Try HuggingFace with better models (Mixtral or Mistral)
async function tryHuggingFace(
	apiKey: string,
	systemPrompt: string,
	userPrompt: string
): Promise<{ prompt: string; model: string } | null> {
	const models = [
		"mistralai/Mixtral-8x7B-Instruct-v0.1",
		"mistralai/Mistral-7B-Instruct-v0.2",
		"meta-llama/Meta-Llama-3-8B-Instruct",
	];

	for (const model of models) {
		try {
			const response = await fetch(
				`https://api-inference.huggingface.co/models/${model}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						inputs: `${systemPrompt}\n\n${userPrompt}`,
						parameters: {
							max_new_tokens: 800,
							temperature: 0.7,
							return_full_text: false,
							do_sample: true,
						},
					}),
				}
			);

			if (!response.ok) continue;

			const data = await response.json();
			const generatedText = (
				Array.isArray(data)
					? data[0]?.generated_text
					: data.generated_text || ""
			)
				.trim()
				.replace(/<\|endoftext\|>|<\/s>|<s>|\[INST\].*?\[\/INST\]/g, "")
				.trim();

			if (generatedText.length > 50) {
				return { prompt: generatedText, model };
			}
		} catch {
			continue;
		}
	}

	return null;
}

// Build system prompt for AI
function buildSystemPrompt(options: any, mode: string | null): string {
	// Mode-specific instructions
	const modeInstructions: Record<string, string> = {
		writing:
			"Focus on creating prompts for content creation, essays, articles, stories, and written materials. Emphasize clarity, structure, and engaging language.",
		coding:
			"Focus on creating prompts for code generation, debugging, technical explanations, and programming tasks. Emphasize precision, best practices, and code quality.",
		creative:
			"Focus on creating prompts for creative tasks, brainstorming, ideation, storytelling, and artistic endeavors. Emphasize imagination, originality, and creative expression.",
		product:
			"Focus on creating prompts for product descriptions, feature documentation, marketing copy, and product-related content. Emphasize clarity, benefits, and user value.",
		research:
			"Focus on creating prompts for analysis, research, deep dives, and investigative tasks. Emphasize thoroughness, accuracy, and critical thinking.",
		general:
			"Create versatile prompts suitable for any task type. Balance comprehensiveness with flexibility.",
	};

	const requirements = [
		"- Be clear, specific, and actionable",
		"- Include relevant context and constraints",
		"- Follow best practices for prompt engineering",
		"- Be ready to use immediately with any AI assistant",
		options.includeRole && "- Include an appropriate role/persona for the AI",
		options.includeTone && "- Specify the tone and style of communication",
		options.includeSafetyRules && "- Include safety and ethical guidelines",
		options.includeExamples && "- Suggest including examples when appropriate",
	].filter(Boolean);

	const modeGuidance =
		mode && modeInstructions[mode]
			? `\n\nMode-specific guidance:\n${modeInstructions[mode]}`
			: "";

	return `You are an expert AI prompt engineer. Your task is to transform a user's simple idea into a comprehensive, well-structured AI prompt that will produce excellent results.

Your generated prompts should:
${requirements.join("\n")}${modeGuidance}

Generate ONLY the final prompt that the user can copy and use. Do NOT include meta-commentary, explanations, or introductions like "Here's your prompt:". Just output the prompt itself.`;
}

// Build user prompt
function buildUserPrompt(idea: string, mode: string | null): string {
	const modeContext = mode
		? `\n\nContext: This prompt is for ${mode} mode. Tailor the generated prompt accordingly.`
		: "";
	return `Transform this idea into a professional, comprehensive AI prompt:\n\n"${idea}"${modeContext}\n\nGenerate a complete, ready-to-use prompt that incorporates best practices and will produce high-quality results.`;
}

// Template-based fallback for when no AI API is available
function generateIntelligentFallback(
	idea: string,
	options: any,
	mode: string | null
): string {
	const parts: string[] = [];

	// Use provided mode, or detect from idea
	let taskType = mode || "general";
	if (!mode) {
		const ideaLower = idea.toLowerCase();
		const taskTypes: Record<string, string[]> = {
			code: [
				"code",
				"programming",
				"react",
				"vue",
				"javascript",
				"python",
				"app",
			],
			writing: ["write", "essay", "article", "story", "content", "blog"],
			analysis: ["analyze", "explain", "review", "understand", "breakdown"],
			planning: ["plan", "schedule", "organize", "manage"],
			creative: ["creative", "design", "art", "generate"],
		};
		for (const [type, keywords] of Object.entries(taskTypes)) {
			if (keywords.some((kw) => ideaLower.includes(kw))) {
				taskType = type;
				break;
			}
		}
	}

	// Role definitions
	const roles: Record<string, string> = {
		code: "You are an expert software engineer and technical consultant with deep knowledge of best practices, design patterns, and modern development frameworks.",
		writing:
			"You are a professional writer and editor with expertise in crafting clear, engaging, and well-structured content.",
		analysis:
			"You are an expert analyst with strong critical thinking skills and the ability to break down complex topics into clear insights.",
		planning:
			"You are a strategic planner and organizer with expertise in project management and systematic thinking.",
		creative:
			"You are a creative professional with expertise in design thinking, innovation, and artistic expression.",
		product:
			"You are a product expert with deep understanding of user needs, product features, and market positioning.",
		research:
			"You are a research specialist with expertise in analysis, data interpretation, and evidence-based insights.",
		general:
			"You are an expert AI assistant designed to help users achieve their goals effectively and safely.",
	};

	if (options.includeRole) {
		parts.push(roles[taskType] || roles.general);
	}

	parts.push(`Your Task:\n${idea}`);

	if (options.includeTone) {
		const toneMap: Record<string, string> = {
			code: "Use a technical but approachable tone with clear explanations and examples.",
			writing: "Use a clear, engaging, and well-structured writing style.",
			creative:
				"Use an imaginative and expressive tone that encourages creativity.",
			product:
				"Use a clear, benefit-focused tone that highlights value and features.",
			research: "Use an analytical, precise, and evidence-based tone.",
		};
		parts.push(
			`Tone: ${
				toneMap[taskType] ||
				"Respond in a professional, clear, and helpful manner appropriate for the context."
			}`
		);
	}

	if (options.includeSafetyRules) {
		parts.push(
			"Safety: Ensure all responses are accurate, ethical, and safe. Do not provide harmful content."
		);
	}

	if (options.includeExamples) {
		parts.push(
			"Include concrete, practical examples that illustrate key concepts and are directly related to the task."
		);
	}

	parts.push(
		"Provide clear, actionable responses. Break down complex information into digestible parts. Be thorough yet concise."
	);

	return parts.join("\n\n");
}
