export interface SetupDefinition {
  model: string;
  harness: string;
}

export interface ProfileDefinition {
  uses: string;
  role?: string;
}

export interface DefaultsDefinition {
  profile?: string;
  tasks?: Record<string, string>;
}

export interface OpenPromptingConfig {
  version: 1;
  setups: Record<string, SetupDefinition>;
  profiles?: Record<string, ProfileDefinition>;
  defaults?: DefaultsDefinition;
  [key: string]: unknown;
}
