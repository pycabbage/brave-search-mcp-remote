import type { QueryParams as ImageQueryParams } from "../tools/images/schemas/input"
import type { ImageSearchApiResponse } from "../tools/images/types"
import type {
  LlmQueryParams,
  LlmRequestHeaders,
} from "../tools/llm_context/schemas/input"
import type { LlmContextSearchApiResponse } from "../tools/llm_context/schemas/output"
import type {
  LocalDescriptionsParams,
  LocalPoisParams,
} from "../tools/local/params"
import type {
  LocalDescriptionsSearchApiResponse,
  LocalPoiSearchApiResponse,
} from "../tools/local/types"
import type { QueryParams as NewsQueryParams } from "../tools/news/params"
import type { NewsSearchApiResponse } from "../tools/news/types"
import type {
  PlaceSearchQueryParams,
  PlaceSearchRequestHeaders,
} from "../tools/place_search/schemas/input"
import type { PlaceSearchApiResponse } from "../tools/place_search/schemas/output"
import type { SummarizerQueryParams } from "../tools/summarizer/params"
import type { SummarizerSearchApiResponse } from "../tools/summarizer/types"
import type { QueryParams as VideoQueryParams } from "../tools/videos/params"
import type { VideoSearchApiResponse } from "../tools/videos/types"
import type { QueryParams as WebQueryParams } from "../tools/web/params"
import type { WebSearchApiResponse } from "../tools/web/types"

export type Endpoints = {
  web: {
    params: WebQueryParams
    response: WebSearchApiResponse
    requestHeaders: Headers
  }
  images: {
    params: ImageQueryParams
    response: ImageSearchApiResponse
    requestHeaders: Headers
  }
  videos: {
    params: VideoQueryParams
    response: VideoSearchApiResponse
    requestHeaders: Headers
  }
  news: {
    params: NewsQueryParams
    response: NewsSearchApiResponse
    requestHeaders: Headers
  }
  localPois: {
    params: LocalPoisParams
    response: LocalPoiSearchApiResponse
    requestHeaders: Headers
  }
  localDescriptions: {
    params: LocalDescriptionsParams
    response: LocalDescriptionsSearchApiResponse
    requestHeaders: Headers
  }
  summarizer: {
    params: SummarizerQueryParams
    response: SummarizerSearchApiResponse
    requestHeaders: Headers
  }
  llmContext: {
    params: LlmQueryParams
    response: LlmContextSearchApiResponse
    requestHeaders: LlmRequestHeaders
  }
  placeSearch: {
    params: PlaceSearchQueryParams
    response: PlaceSearchApiResponse
    requestHeaders: PlaceSearchRequestHeaders
  }
}
