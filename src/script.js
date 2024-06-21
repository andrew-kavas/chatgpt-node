import readline from 'readline';

import { config } from 'dotenv';
import OpenAI from 'openai';

import fetchUrlContent from '#src/fetch-url-content.js';

const {
  // console,
  process
} = globalThis;

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const execute = async () => {
  const url = 'https://example.com';
  const htmlContent = await fetchUrlContent({ url });

  const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  userInterface.prompt();
  userInterface.on('line', async input => {
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `summarize the following html content:

        ${htmlContent}

explain how each element and property works to create this webpage.
describe how you would expect the wepage to look when loaded in a browser`
        },
        { role: 'user', content: input }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    userInterface.prompt();
  });
};

execute();
