import { ExternalClient, IOContext, InstanceOptions, RequestConfig } from '@vtex/api'

class MasterData extends ExternalClient {
   constructor(ctx: IOContext, options?: InstanceOptions) {
      super(`http://api.vtex.com/${ctx.account}/dataentities`, ctx, {
         ...options,
         headers: {
            ...options?.headers,
            ...{ Accept: 'application/vnd.vtex.ds.v10+json' },
            ...(ctx.authToken ? { VtexIdclientAutCookie: ctx.authToken } : null),
         },
      })
   }

   public getSchema = (name: string, entity: string): Promise<Schema | null> => {
      return this.get(this.routes.schema(entity, name), {
         metric: 'masterdata-getSchema',
      })
   }

   public saveSchema = (schema: Schema, { entity, name }: { entity: string; name: string }): Promise<any> => {
      return this.put(this.routes.schema(entity, name), schema, {
         metric: 'masterdata-saveSchema',
      })
   }

   public searchDocuments = <T>(
      acronym: string,
      { schema, fields, where }: { schema?: string; fields?: string[]; where?: string }
   ) => {
      return this.get<T[]>(this.routes.search(acronym), {
         metric: 'masterdata-searchDocuments',
         params: {
            ...(fields ? { _fields: fields.join(',') } : null),
            ...(where ? { _where: where } : null),
            ...(schema ? { _schema: schema } : null),
         },
      })
   }

   protected get = <T>(url: string, config?: RequestConfig) => {
      return this.http.get<T>(url, config)
   }

   protected put = <T>(url: string, data?: any, config?: RequestConfig) => {
      return this.http.put<T>(url, data, config)
   }

   private get routes() {
      return {
         document: (acronym: string, id: string) => `${acronym}/documents/${id}`,
         documents: (acronym: string) => `${acronym}/documents`,
         schema: (acronym: string, schema: string) => `${acronym}/schemas/${schema}`,
         search: (acronym: string) => `${acronym}/search`,
      }
   }
}

export default MasterData
