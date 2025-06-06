import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Client = {
  __typename?: 'Client';
  hasFeaturedJobs: Scalars['Boolean']['output'];
  jobBoardTitle?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Company = {
  __typename?: 'Company';
  careerPageUrl?: Maybe<Scalars['String']['output']>;
  cdrCategory: Scalars['String']['output'];
  companySize: Scalars['String']['output'];
  companyUrl: Scalars['String']['output'];
  hqLocation?: Maybe<Location>;
  id: Scalars['ID']['output'];
  logoUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GetClientResult = {
  __typename?: 'GetClientResult';
  data: Client;
};

export type Job = {
  __typename?: 'Job';
  company: Company;
  contractTypes: Array<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  disciplines: Array<Scalars['String']['output']>;
  guessedMinYearsOfExperience?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  locations?: Maybe<Array<Location>>;
  maxSalary?: Maybe<Scalars['Int']['output']>;
  minSalary?: Maybe<Scalars['Int']['output']>;
  minYearsOfExperience?: Maybe<Scalars['Int']['output']>;
  publishedAt?: Maybe<Scalars['String']['output']>;
  remote: Scalars['String']['output'];
  sourceUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Location = {
  __typename?: 'Location';
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
};

export type Pagination = {
  __typename?: 'Pagination';
  countAfter: Scalars['String']['output'];
  limit: Scalars['Int']['output'];
  takeAfter: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getClient: GetClientResult;
  searchCompanies?: Maybe<SearchCompaniesResults>;
  searchFeaturedJobs?: Maybe<SearchFeaturedJobsResults>;
  searchJobs?: Maybe<SearchJobsResults>;
};


export type QueryGetClientArgs = {
  clientKey: Scalars['String']['input'];
};


export type QuerySearchCompaniesArgs = {
  clientKey: Scalars['String']['input'];
  ids: Array<Scalars['String']['input']>;
};


export type QuerySearchFeaturedJobsArgs = {
  clientKey: Scalars['String']['input'];
  filters?: InputMaybe<JobFiltersInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchJobsArgs = {
  clientKey: Scalars['String']['input'];
  filters?: InputMaybe<JobFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type SearchCompaniesResults = {
  __typename?: 'SearchCompaniesResults';
  data: Array<Company>;
};

export type CoordinatesInput = {
  lat: Scalars['Float']['input'];
  long: Scalars['Float']['input'];
};

export type JobFiltersInput = {
  cdrCategory?: InputMaybe<Array<Scalars['String']['input']>>;
  companies?: InputMaybe<Array<Scalars['String']['input']>>;
  companySize?: InputMaybe<Array<Scalars['String']['input']>>;
  contractType?: InputMaybe<Array<Scalars['String']['input']>>;
  discipline?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationInput>;
  openSearchToCountries?: InputMaybe<Scalars['Boolean']['input']>;
  remote?: InputMaybe<Array<Scalars['String']['input']>>;
  requiredExperience?: InputMaybe<Array<MinMaxYearsOfExperience>>;
};

export type LocationInput = {
  coordinates?: InputMaybe<CoordinatesInput>;
  country?: InputMaybe<Scalars['String']['input']>;
};

export type MinMaxYearsOfExperience = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export type PaginationInput = {
  countAfter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  takeAfter?: InputMaybe<Scalars['String']['input']>;
};

export type SearchFeaturedJobsResults = {
  __typename?: 'searchFeaturedJobsResults';
  data: Array<Job>;
};

export type SearchJobsResults = {
  __typename?: 'searchJobsResults';
  data: Array<Job>;
  pagination: Pagination;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Client: ResolverTypeWrapper<Client>;
  Company: ResolverTypeWrapper<Company>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GetClientResult: ResolverTypeWrapper<GetClientResult>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Job: ResolverTypeWrapper<Job>;
  Location: ResolverTypeWrapper<Location>;
  Pagination: ResolverTypeWrapper<Pagination>;
  Query: ResolverTypeWrapper<{}>;
  SearchCompaniesResults: ResolverTypeWrapper<SearchCompaniesResults>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  coordinatesInput: CoordinatesInput;
  jobFiltersInput: JobFiltersInput;
  locationInput: LocationInput;
  minMaxYearsOfExperience: MinMaxYearsOfExperience;
  paginationInput: PaginationInput;
  searchFeaturedJobsResults: ResolverTypeWrapper<SearchFeaturedJobsResults>;
  searchJobsResults: ResolverTypeWrapper<SearchJobsResults>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Client: Client;
  Company: Company;
  Float: Scalars['Float']['output'];
  GetClientResult: GetClientResult;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Job: Job;
  Location: Location;
  Pagination: Pagination;
  Query: {};
  SearchCompaniesResults: SearchCompaniesResults;
  String: Scalars['String']['output'];
  coordinatesInput: CoordinatesInput;
  jobFiltersInput: JobFiltersInput;
  locationInput: LocationInput;
  minMaxYearsOfExperience: MinMaxYearsOfExperience;
  paginationInput: PaginationInput;
  searchFeaturedJobsResults: SearchFeaturedJobsResults;
  searchJobsResults: SearchJobsResults;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  hasFeaturedJobs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jobBoardTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  careerPageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cdrCategory?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companySize?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hqLocation?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetClientResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetClientResult'] = ResolversParentTypes['GetClientResult']> = {
  data?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JobResolvers<ContextType = any, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  contractTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  disciplines?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  guessedMinYearsOfExperience?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locations?: Resolver<Maybe<Array<ResolversTypes['Location']>>, ParentType, ContextType>;
  maxSalary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minSalary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minYearsOfExperience?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  publishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remote?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = {
  countAfter?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  takeAfter?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getClient?: Resolver<ResolversTypes['GetClientResult'], ParentType, ContextType, RequireFields<QueryGetClientArgs, 'clientKey'>>;
  searchCompanies?: Resolver<Maybe<ResolversTypes['SearchCompaniesResults']>, ParentType, ContextType, RequireFields<QuerySearchCompaniesArgs, 'clientKey' | 'ids'>>;
  searchFeaturedJobs?: Resolver<Maybe<ResolversTypes['searchFeaturedJobsResults']>, ParentType, ContextType, RequireFields<QuerySearchFeaturedJobsArgs, 'clientKey' | 'limit'>>;
  searchJobs?: Resolver<Maybe<ResolversTypes['searchJobsResults']>, ParentType, ContextType, RequireFields<QuerySearchJobsArgs, 'clientKey'>>;
};

export type SearchCompaniesResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchCompaniesResults'] = ResolversParentTypes['SearchCompaniesResults']> = {
  data?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchFeaturedJobsResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['searchFeaturedJobsResults'] = ResolversParentTypes['searchFeaturedJobsResults']> = {
  data?: Resolver<Array<ResolversTypes['Job']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchJobsResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['searchJobsResults'] = ResolversParentTypes['searchJobsResults']> = {
  data?: Resolver<Array<ResolversTypes['Job']>, ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Client?: ClientResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  GetClientResult?: GetClientResultResolvers<ContextType>;
  Job?: JobResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchCompaniesResults?: SearchCompaniesResultsResolvers<ContextType>;
  searchFeaturedJobsResults?: SearchFeaturedJobsResultsResolvers<ContextType>;
  searchJobsResults?: SearchJobsResultsResolvers<ContextType>;
};

