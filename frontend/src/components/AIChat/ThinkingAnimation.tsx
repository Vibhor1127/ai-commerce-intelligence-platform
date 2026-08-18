import { PipelineAnimation } from '@/components/AIChat/PipelineAnimation'

export function ThinkingAnimation({ question }: { question?: string }) {
  return <PipelineAnimation active complete={false} question={question} />
}
