import readline from 'readline';

import { config } from 'dotenv';
import OpenAI from 'openai';

import fetchUrlContent from '#src/fetch-url-content.js';

const { console, process } = globalThis;

config();

// console.log(process.env);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const execute = async () => {
  const url = 'https://example.com';
  const htmlContent = await fetchUrlContent({ url });

  console.log(htmlContent);

  // const stream = await openai.chat.completions.create({
  //   model: 'gpt-4',
  //   messages: [{ role: 'user', content: 'Say this is a test' }],
  //   stream: true
  // });

  // const stream = await openai.chat.completions.create({
  //   model: 'gpt-3.5-turbo',
  //   messages: [
  //     { role: 'system', content: 'You are a helpful assistant.' },
  //     { role: 'user', content: 'Who won the world series in 2020?' },
  //     {
  //       role: 'assistant',
  //       content: 'The Los Angeles Dodgers won the World Series in 2020.'
  //     },
  //     { role: 'user', content: 'Where was it played?' }
  //   ],
  //   stream: true
  // });

  // const stream = await openai.chat.completions.create({
  //   model: 'gpt-3.5-turbo',
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         'You are a helpful programming assistant who is adept at parsing html content and providing a human-readable summary.'
  //     },
  //     {
  //       role: 'user',
  //       content: `summarize the following html content:
  // ${htmlContent}
  // explain how each element and property works to create this webpage.
  // describe how you would expect the wepage to look when loaded in a browser`
  //     }
  //   ],
  //   stream: true
  // });

  // for await (const chunk of stream) {
  //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
  // }

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

    // console.log(stream, stream.choices[0]?.message.choices[0].message.content);
    userInterface.prompt();
  });

  // return htmlContent;
};

execute();
