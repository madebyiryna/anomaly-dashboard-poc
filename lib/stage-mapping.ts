// Stage mapping utilities for consistent stage name handling across the application

export type StageId = 'data-quality' | 'smart-dq' | 'business'
export type StageName = 'Data Quality' | 'Smart Data Quality' | 'Business'
export type StageDisplayName = 'Data Quality' | 'Smart Data Quality' | 'Business Rules'

export interface StageInfo {
  id: StageId
  name: StageName
  displayName: StageDisplayName
  description: string
  color: string
  icon?: string
}

export const STAGE_MAPPING: Record<StageName, StageInfo> = {
  'Data Quality': {
    id: 'data-quality',
    name: 'Data Quality',
    displayName: 'Data Quality',
    description: 'Basic data quality checks and validation',
    color: 'bg-blue-500',
  },
  'Smart Data Quality': {
    id: 'smart-dq',
    name: 'Smart Data Quality',
    displayName: 'Smart Data Quality',
    description: 'Advanced ML-powered data quality analysis',
    color: 'bg-purple-500',
  },
  'Business': {
    id: 'business',
    name: 'Business',
    displayName: 'Business Rules',
    description: 'Business logic validation and KPI monitoring',
    color: 'bg-green-500',
  },
}

// Helper functions
export function getStageInfo(stageName: StageName): StageInfo | undefined {
  return STAGE_MAPPING[stageName]
}

export function getStageInfoById(stageId: StageId): StageInfo | undefined {
  return Object.values(STAGE_MAPPING).find(stage => stage.id === stageId)
}

export function getStageId(stageName: StageName): StageId {
  return STAGE_MAPPING[stageName].id
}

export function getStageDisplayName(stageName: StageName): StageDisplayName {
  return STAGE_MAPPING[stageName].displayName
}

export function getStageDisplayNameSafe(stageName: string): string {
  // Try to find the stage by name first
  const stage = STAGE_MAPPING[stageName as StageName]
  if (stage) {
    return stage.displayName
  }
  
  // If not found, return the original name
  return stageName
}

export function getStageName(stageId: StageId): StageName | undefined {
  const stage = getStageInfoById(stageId)
  return stage?.name
}

export function getAllStages(): StageInfo[] {
  return Object.values(STAGE_MAPPING)
}

export function getStageNames(): StageName[] {
  return Object.keys(STAGE_MAPPING) as StageName[]
}

export function getStageIds(): StageId[] {
  return Object.values(STAGE_MAPPING).map(stage => stage.id)
}

// For export dialog and other UI components
export const STAGE_OPTIONS = [
  { id: 'all', label: 'All Stages' },
  ...getAllStages().map(stage => ({
    id: stage.id,
    label: stage.displayName
  }))
]
