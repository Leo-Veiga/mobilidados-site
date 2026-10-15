import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BotaoDados from '@/components/BotaoDados';
import CabecalhoPagina from '@/components/CabecalhoPagina';
import FichaCapital from '@/components/capitais/FichaCapital';
import ListaIndicadoresLocal from '@/components/local/ListaIndicadoresLocal';
import { capitais, capitalPorSlug, dadosFicha, estacoesTma, indicadoresDoLocal } from '@/lib/dados';
import { asset } from '@/lib/formato';
import styles from './pagina.module.css';

type Params = { params: Promise<{ slug: string }> };

// Uma página HTML por capital, gerada no build
export const dynamicParams = false;
export function generateStaticParams() {
  return capitais.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = capitalPorSlug((await params).slug)!;
  return {
    title: `${c.nome} (${c.uf})`,
    description: `Indicadores de mobilidade urbana de ${c.nome} (${c.uf}): transporte, infraestrutura cicloviária, segurança viária, emissões e mais.`,
  };
}

export default async function PaginaCapital({ params }: Params) {
  const c = capitalPorSlug((await params).slug);
  if (!c) notFound();
  const itens = indicadoresDoLocal('capitais', c.slug);

  return (
    <>
      <CabecalhoPagina titulo={`${c.nome} (${c.uf})`} voltar={{ href: '/capitais/', texto: 'Voltar para localizações' }} />

      <div className="container-texto">
        {c.texto && <p className={styles.apresentacao}>{c.texto}</p>}

        <section className={styles.bloco} aria-label="Dados da capital">
          <FichaCapital c={c} ficha={dadosFicha('capitais', c.slug)} tma={estacoesTma('capitais', c.slug)} />
          <div className="centro"><BotaoDados href={asset('/dados/capitais-informacoes-gerais.csv')} /></div>
        </section>

        <section className={styles.bloco} aria-labelledby="titulo-indicadores">
          <h2 id="titulo-indicadores" className={styles.titulo}>Busca por indicadores</h2>
          <ListaIndicadoresLocal itens={itens} local={c.slug} />
        </section>
      </div>
    </>
  );
}
