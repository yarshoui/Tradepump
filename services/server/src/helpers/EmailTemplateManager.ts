import * as path from 'path';
import { existsSync, readFileSync } from 'fs';

interface EmailTemplateManagerOptions {
    encoding: BufferEncoding,
    templatesDirectory: string,
}

export class EmailTemplateManager {
    static #instance: EmailTemplateManager;
    private options: EmailTemplateManagerOptions;

    constructor(opts: Partial<EmailTemplateManagerOptions>) {
        this.options = {
            encoding: 'utf-8',
            templatesDirectory: path.resolve(__dirname, '..', 'static'),
            ...opts,
        }
    }

    renderTemplate(templateName: string, params?: Record<string, any>): string {
        const templateFile = path.resolve(this.options.templatesDirectory, `${templateName.replace(/\.html$/, '')}.html`);

        if (!existsSync(templateFile)) {
            throw new Error(`Template '${templateName}' does not exists.`);
        }
        let content = readFileSync(templateFile, {encoding: this.options.encoding});

        if (!params) return content;

        for (const name in params) {
            const value = params[name];

            content = content.replace(new RegExp(`{{${name}}}`, 'gmi'), value);
        }

        return content;
    }

    static getTemplate(templateName: string, params?: Record<string, any>): string {
        return this.#instance.renderTemplate(templateName, params);
    }
}