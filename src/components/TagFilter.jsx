const TagFilter = ({ allTags, activeTags = [], onTagClick, onClear }) => {
  const sortedTags = [...allTags].sort()

  return (
    <div className="tag-filter-bar">
      <div className="tag-filter-chips">
        {sortedTags.map((tag) => (
          <button
            key={tag}
            className={`tag-chip ${activeTags.includes(tag) ? 'active' : ''}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {activeTags.length > 0 && (
        <button className="clear-filters-btn" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}

export default TagFilter
