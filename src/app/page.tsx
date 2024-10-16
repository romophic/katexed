import Head from 'next/head';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>LaTeX Online</title>
        <meta name="description" content="Render LaTeX equations online" />
      </Head>
      <main>
        <h1>Online LaTeX Renderer</h1>
        <p>Here is an example of rendered LaTeX:</p>
        <BlockMath math="\int_0^\infty x^2 dx" />
      </main>
    </div>
  );
}
