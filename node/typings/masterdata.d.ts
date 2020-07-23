interface Schema {
   properties: Record<string, Property>
   'v-cache': boolean
   'v-default-fields': string[]
   'v-indexed': string[]
}

interface Property {
   type: string
   format?: string
   minimum?: string
}
