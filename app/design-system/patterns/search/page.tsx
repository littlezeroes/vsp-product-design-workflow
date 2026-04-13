const rules = [
  {
    number: 1,
    title: 'Search Bar Placement',
    summary: 'Position the search bar below the header and make it sticky on scroll.',
    points: [
      'The search bar sits directly below the NavBar, inside the content area.',
      'On scroll, the search bar sticks to the top so users can refine at any point.',
    ],
  },
  {
    number: 2,
    title: 'Filter Chips',
    summary: 'Show filter options as a horizontal scrollable row of chips below the search bar.',
    points: [
      'Use chip-style buttons (32px height, rounded-full) for each filter category.',
      'Active chips use foreground bg with background text; inactive use secondary bg.',
      'Horizontal scroll with no visible scrollbar for overflow.',
    ],
  },
  {
    number: 3,
    title: 'Immediate Results',
    summary: 'Return results as the user types with a 300ms debounce.',
    points: [
      'Debounce input at 300ms to avoid excessive API calls.',
      'Highlight the matched text within results using font-semibold styling.',
      'Show a subtle loading indicator in the search field during fetch.',
    ],
  },
  {
    number: 4,
    title: 'Empty Results',
    summary: 'Display an illustration, explanation, and alternative suggestion when no results match.',
    points: [
      'Center a Lucide icon (48px, muted) with a short empathetic title.',
      'Suggest correcting spelling or trying a different keyword.',
      'Offer a CTA to clear filters or browse all items.',
    ],
  },
  {
    number: 5,
    title: 'Clear Controls',
    summary: 'Provide an X button inside the search field and a "Clear all" action for filters.',
    points: [
      'The X icon appears inside the field only when text is present.',
      '"Clear all" appears at the end of the filter chip row when any filter is active.',
    ],
  },
  {
    number: 6,
    title: 'Recent Searches',
    summary: 'Show recent search terms when the field is focused and empty.',
    points: [
      'Display the last 5 search terms as tappable rows below the field.',
      'Include a "Clear recent" link at the bottom of the list.',
      'Recent searches disappear once the user starts typing.',
    ],
  },
]

export default function SearchPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Search & Filter
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Patterns for search input, filtering, and result presentation across the app.
        </p>
      </section>

      {/* Rules */}
      <section className="flex flex-col gap-[24px]">
        {rules.map((r) => (
          <div key={r.number} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="flex items-baseline gap-[8px]">
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {String(r.number).padStart(2, '0')}
              </span>
              <h3
                className="text-[18px] font-semibold leading-[28px]"
                style={{ color: 'var(--foreground)' }}
              >
                {r.title}
              </h3>
            </div>
            <p
              className="pl-[28px] text-[14px] font-medium leading-[20px]"
              style={{ color: 'var(--foreground)' }}
            >
              {r.summary}
            </p>
            <div className="flex flex-col gap-[4px] pl-[28px]">
              {r.points.map((point, i) => (
                <div key={i} className="flex items-start gap-[8px]">
                  <span
                    className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--foreground-secondary)' }}
                  />
                  <p
                    className="text-[13px] leading-[20px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
