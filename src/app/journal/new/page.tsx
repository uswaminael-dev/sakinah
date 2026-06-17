import JournalEditor from '@/components/JournalEditor'

export default function NewJournalEntryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <JournalEditor entry={null} />
    </div>
  )
}