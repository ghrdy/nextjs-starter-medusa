import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre Histoire",
  description: "Découvrez l'histoire et l'authenticité de La Bella Vista.",
}

export default function NotreHistoirePage() {
  return (
    <div className="flex flex-col content-container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl-semi font-bold mb-8 text-center">
        Notre Histoire
      </h1>

      <div className="prose prose-neutral max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl-semi font-semibold mb-4">
            La naissance de La Bella Vista
          </h2>
          <p className="mb-4">
            Fondée en 2010 par la famille Rossi, La Bella Vista est née d'une
            passion profonde pour la cuisine italienne authentique et le désir
            de partager les saveurs traditionnelles de l'Italie avec la
            communauté de Saint-Germain-lès-Corbeil.
          </p>
          <p>
            Notre restaurant tire son nom de la magnifique vue ("bella vista" en
            italien) qu'offrait le premier établissement familial situé sur les
            collines toscanes, d'où notre famille est originaire.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl-semi font-semibold mb-4">
            Notre philosophie
          </h2>
          <p className="mb-4">
            Chez La Bella Vista, nous croyons que la cuisine italienne est bien
            plus qu'une simple nourriture — c'est une célébration de la vie, de
            la famille et de la convivialité. Nous nous engageons à préparer
            chaque plat avec amour et attention, en utilisant des ingrédients
            frais et de qualité supérieure.
          </p>
          <p>
            Notre menu est inspiré des recettes familiales transmises de
            génération en génération, conjuguant tradition et innovation pour
            offrir une expérience culinaire inoubliable à nos clients.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl-semi font-semibold mb-4">Notre équipe</h2>
          <p className="mb-4">
            Notre équipe est composée de passionnés qui partagent notre amour
            pour la gastronomie italienne. De nos chefs expérimentés à notre
            personnel de service attentionné, chaque membre contribue à créer
            une atmosphère chaleureuse et accueillante qui fait la réputation de
            La Bella Vista.
          </p>
          <p>
            Nous sommes fiers de perpétuer la tradition d'hospitalité italienne
            et de faire de chaque visite une occasion spéciale pour nos clients.
          </p>
        </section>

        <section>
          <h2 className="text-2xl-semi font-semibold mb-4">Notre engagement</h2>
          <p className="mb-4">
            À La Bella Vista, nous nous engageons à soutenir les producteurs
            locaux et à minimiser notre impact environnemental. Nous
            sélectionnons soigneusement nos fournisseurs et privilégions les
            produits de saison pour garantir fraîcheur et qualité.
          </p>
          <p>
            Notre objectif est de vous offrir une expérience culinaire
            authentique qui respecte à la fois les traditions italiennes et
            notre environnement.
          </p>
        </section>
      </div>
    </div>
  )
}
