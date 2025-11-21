export type Mode =
	| "general"
	| "writing"
	| "coding"
	| "creative"
	| "product"
	| "research"
	| null;
export type Screen = "landing" | "detail" | "result";

export interface ModeConfig {
	id: Mode;
	title: string;
	description: string;
	icon: string;
}

export interface HistoryItem {
	id: string;
	mode: Mode;
	title: string;
	prompt: string;
	timestamp: Date;
}

export interface PromptOptions {
	includeRole: boolean;
	includeTone: boolean;
	includeSafetyRules: boolean;
	includeExamples: boolean;
}
