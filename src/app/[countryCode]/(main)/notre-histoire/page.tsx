import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre Histoire",
  description: "Découvrez l'histoire et l'authenticité de La Bella Vista.",
}

export default function NotreHistoirePage() {
  return (
    <div className="flex flex-col content-container py-10 max-w-4xl mx-auto bg-zinc-900 text-gray-200 rounded-lg">
      <h1 className="text-3xl-semi font-bold mb-8 text-center text-amber-500">
        L'Exigence du Goût
      </h1>

      <div className="prose prose-invert max-w-none px-6">
        <p className="text-xl mb-8 text-center italic font-light">
          La Bella Vista est née d'une conviction forte : la vraie pizza mérite
          des ingrédients d'exception.
        </p>

        <section className="mb-10">
          <p className="mb-4">
            Ici, rien n'est laissé au hasard. Chaque produit est choisi avec
            soin pour sa fraîcheur, sa provenance, et son excellence. Nous
            privilégions les produits bio, certifiés AOP, issus de filières
            responsables et respectueuses des saisons. La découpe se fait à la
            commande, pour sublimer chaque ingrédient au moment même de la
            préparation.
          </p>
        </section>

        <section className="mb-10">
          <p className="mb-4">
            Notre charcuterie ? Elle est confiée à un artisan boucher passionné,
            qui élabore des produits sans sel nitrité, sans VSM, dans le respect
            des savoir-faire traditionnels. Une approche rare et exigeante, au
            service d'une qualité irréprochable.
          </p>
        </section>

        <section>
          <p className="text-lg font-medium text-amber-400 mb-4">
            Chez La Bella Vista, la pizza devient une expérience. Fine,
            élégante, saine, généreuse — elle raconte une histoire, celle de
            l'Italie, revisitée avec un regard moderne, sincère et profondément
            engagé.
          </p>
        </section>
      </div>
    </div>
  )
}
