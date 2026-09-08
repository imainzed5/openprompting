import { createInterface, type Interface } from 'node:readline/promises';
import type { Readable, Writable } from 'node:stream';

export interface PromptChoice {
  value: string;
  label?: string;
}

export interface SetupPrompter {
  input(message: string, initial?: string): Promise<string | undefined>;
  confirm(message: string, initial?: boolean): Promise<boolean | undefined>;
  select(message: string, choices: PromptChoice[]): Promise<string | undefined>;
  show(message: string): void;
}

export class ConsolePrompter implements SetupPrompter {
  readonly #readline: Interface;
  readonly #output: Writable;

  public constructor(input: Readable, output: Writable) {
    this.#readline = createInterface({ input, output });
    this.#output = output;
  }

  public close(): void {
    this.#readline.close();
  }

  public async input(message: string, initial?: string): Promise<string | undefined> {
    const suffix = initial ? ` [${initial}]` : '';
    const answer = (await this.#readline.question(`${message}${suffix}: `)).trim();
    if (answer.toLowerCase() === 'q') return undefined;
    return answer || initial || '';
  }

  public async confirm(message: string, initial = false): Promise<boolean | undefined> {
    const answer = (await this.#readline.question(`${message} ${initial ? '[Y/n]' : '[y/N]'}: `)).trim().toLowerCase();
    if (answer === 'q') return undefined;
    if (!answer) return initial;
    if (answer === 'y' || answer === 'yes') return true;
    if (answer === 'n' || answer === 'no') return false;
    return this.confirm(message, initial);
  }

  public async select(message: string, choices: PromptChoice[]): Promise<string | undefined> {
    this.#output.write(`${message}\n`);
    choices.forEach((choice, index) => this.#output.write(`  ${index + 1}. ${choice.label ?? choice.value}\n`));
    const answer = await this.input('Choose a number (or q to cancel)');
    if (answer === undefined) return undefined;
    const choice = choices[Number(answer) - 1];
    if (!choice) return this.select(message, choices);
    return choice.value;
  }

  public show(message: string): void {
    this.#output.write(`${message}\n`);
  }
}
