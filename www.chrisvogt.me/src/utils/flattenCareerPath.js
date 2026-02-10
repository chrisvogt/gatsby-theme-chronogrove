/**
 * Flattens the hierarchical career-path.json into an array of role entries
 * for use in timeline or list visualizations. Preserves path (Design/IT/Engineering)
 * and handles nested roles (e.g. GoDaddy sub-roles).
 *
 * @param {object} data - Raw career-path.json root
 * @returns {Array<{ pathName, pathColor, company, title, dates, startYear, endYear, description, type }>}
 */
export function flattenCareerPath(data) {
  const entries = []

  function visit(node, pathInfo) {
    if (!node) return

    if (node.type === 'path') {
      const nextPath = { name: node.name, color: node.color }
      node.children?.forEach(child => visit(child, nextPath))
      return
    }

    if (node.type === 'job' && node.name === 'GoDaddy' && node.children?.length) {
      node.children.forEach(role => {
        entries.push({
          pathName: pathInfo.name,
          pathColor: pathInfo.color,
          company: 'GoDaddy',
          title: role.title,
          dates: role.dates,
          startYear: role.startYear,
          endYear: role.endYear,
          description: role.description,
          type: 'role'
        })
      })
      return
    }

    if (node.type === 'job') {
      entries.push({
        pathName: pathInfo.name,
        pathColor: pathInfo.color,
        company: node.name,
        title: node.title,
        dates: node.dates,
        startYear: node.startYear,
        endYear: node.endYear,
        description: node.description,
        type: 'job'
      })
      return
    }

    node.children?.forEach(child => visit(child, pathInfo))
  }

  data.children?.forEach(child => visit(child, null))

  return entries.sort(
    (a, b) => a.startYear - b.startYear || a.endYear - b.endYear || a.company.localeCompare(b.company)
  )
}

/**
 * Groups flattened career entries by company. One row per job (company), with
 * multiple segments (Design / IT / Engineering) as separate bars in that row.
 *
 * @param {object} data - Raw career-path.json root
 * @returns {Array<{ company, segments: Array<{ pathName, pathColor, title, dates, startYear, endYear, description }> }>}
 */
export function groupCareerByCompany(data) {
  const entries = flattenCareerPath(data)
  const byCompany = {}

  entries.forEach(entry => {
    const key = entry.company
    if (!byCompany[key]) {
      byCompany[key] = { company: key, segments: [] }
    }
    byCompany[key].segments.push({
      pathName: entry.pathName,
      pathColor: entry.pathColor,
      title: entry.title,
      dates: entry.dates,
      startYear: entry.startYear,
      endYear: entry.endYear,
      description: entry.description
    })
  })

  Object.values(byCompany).forEach(row => {
    row.segments.sort((a, b) => a.startYear - b.startYear || a.endYear - b.endYear)
  })

  const rows = Object.values(byCompany)
  const earliestStart = row => Math.min(...row.segments.map(s => s.startYear))
  rows.sort((a, b) => earliestStart(a) - earliestStart(b))

  return rows
}
