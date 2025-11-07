<script lang="ts">
	import { Globe, PenTool, Users, Lightbulb } from '@lucide/svelte';
</script>

<div class="bg-white py-16 sm:py-8">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-sky-600">Over Ons</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Een passie voor architectuur
      </p>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Welkom bij het architectenbureau van Maria Hoogland, waar we geloven in de kracht van doordacht ontwerp om levens te verrijken en gemeenschappen te versterken. Ontdek ons verhaal, onze filosofie en het team achter onze projecten.
      </p>
    </div>

    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
              <Globe class="h-6 w-6 text-white" />
            </div>
            Onze Filosofie
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">
            Wij streven naar een architectuur die zowel esthetisch als functioneel is, met een diep respect voor de context en het milieu. Elk ontwerp is een dialoog tussen de wensen van de klant, de potentie van de locatie en onze creatieve visie.
          </dd>
        </div>

        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
              <PenTool class="h-6 w-6 text-white" />
            </div>
            Duurzaam Ontwerpen
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">
            Duurzaamheid is de kern van ons werk. We integreren energie-efficiënte oplossingen, gebruiken milieuvriendelijke materialen en ontwerpen gebouwen die flexibel en toekomstbestendig zijn, met een minimale ecologische voetafdruk.
          </dd>
        </div>

        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
              <Users class="h-6 w-6 text-white" />
            </div>
            Klantgerichte Aanpak
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">
            Uw visie staat centraal. We luisteren aandachtig naar uw wensen en vertalen deze naar een concreet ontwerp. Gedurende het hele proces, van de eerste schets tot de uiteindelijke oplevering, zorgen we voor een transparante communicatie en nauwe samenwerking.
          </dd>
        </div>

        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
              <Lightbulb class="h-6 w-6 text-white" />
            </div>
            Innovatie en Expertise
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">
            Met een scherp oog voor detail en een passie voor innovatie, combineren we beproefde methoden met de nieuwste technologieën. Ons team beschikt over de expertise om complexe uitdagingen aan te gaan en unieke, hoogwaardige architectuur te realiseren.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>

<!-- Team Section -->
<div class="bg-gray-50/50 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Maak kennis met de architecte</h2>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Gedreven door een passie voor het creëren van betekenisvolle ruimtes, staat Maria Hoogland aan het roer van elk project, van concept tot realisatie.
      </p>
    </div>
    <div class="mt-20 flex justify-center">
      <ul role="list" class="max-w-sm">
        <li>
          <img class="aspect-[1/1] w-full rounded-2xl object-cover" src="/images/maria2.jpg" alt="Portretfoto van Maria Hoogland">
          <h3 class="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">Maria Hoogland</h3>
          <p class="text-base leading-7 text-gray-600">Oprichter & Architect</p>
        </li>
      </ul>
    </div>
  </div>
</div>
