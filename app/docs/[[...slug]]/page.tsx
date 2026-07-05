import { getPageImage, getPageMarkdownUrl, getSource } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const docs = await getSource();
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  const { render } = await page.data.load();
  const { toc, body } = await render(
    getMDXComponents({
      a: createRelativeLink(docs, page),
    }),
  );

  return (
    <DocsPage toc={toc} full={page.data.frontmatter.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const docs = await getSource();
  return docs.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const docs = await getSource();
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
