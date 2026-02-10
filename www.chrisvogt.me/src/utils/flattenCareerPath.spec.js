import { flattenCareerPath, groupCareerByCompany } from './flattenCareerPath'

const mockCareerData = {
  name: 'Career Journey',
  startYear: 2003,
  children: [
    {
      name: 'Engineering Path',
      type: 'path',
      color: '#48bb78',
      children: [
        {
          name: 'GoDaddy',
          type: 'job',
          startYear: 2017,
          endYear: 2026,
          children: [
            { title: 'Software Engineer III', startYear: 2017, endYear: 2021, type: 'role' },
            { title: 'Principal Software Engineer', startYear: 2025, endYear: 2026, type: 'role' }
          ]
        }
      ]
    },
    {
      name: 'Design Path',
      type: 'path',
      color: '#ed8936',
      children: [{ name: 'OfficeMax', type: 'job', title: 'Desktop Publisher', startYear: 2003, endYear: 2005 }]
    }
  ]
}

describe('flattenCareerPath', () => {
  it('returns an array of entries', () => {
    const result = flattenCareerPath(mockCareerData)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('expands GoDaddy roles into separate entries', () => {
    const result = flattenCareerPath(mockCareerData)
    const godaddyEntries = result.filter(e => e.company === 'GoDaddy')
    expect(godaddyEntries).toHaveLength(2)
    expect(godaddyEntries.map(e => e.title)).toContain('Software Engineer III')
    expect(godaddyEntries.map(e => e.title)).toContain('Principal Software Engineer')
  })

  it('assigns path name and color to each entry', () => {
    const result = flattenCareerPath(mockCareerData)
    result.forEach(entry => {
      expect(entry.pathName).toBeDefined()
      expect(entry.pathColor).toBeDefined()
    })
    expect(result.find(e => e.company === 'OfficeMax').pathName).toBe('Design Path')
    expect(result.find(e => e.company === 'GoDaddy').pathName).toBe('Engineering Path')
  })

  it('sorts entries by start year', () => {
    const result = flattenCareerPath(mockCareerData)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].startYear).toBeGreaterThanOrEqual(result[i - 1].startYear)
    }
  })
})

describe('groupCareerByCompany', () => {
  it('returns one row per company', () => {
    const result = groupCareerByCompany(mockCareerData)
    expect(result.map(r => r.company)).toContain('GoDaddy')
    expect(result.map(r => r.company)).toContain('OfficeMax')
    expect(result).toHaveLength(2)
  })

  it('groups GoDaddy roles into segments on one row', () => {
    const result = groupCareerByCompany(mockCareerData)
    const godaddy = result.find(r => r.company === 'GoDaddy')
    expect(godaddy.segments).toHaveLength(2)
    expect(godaddy.segments.map(s => s.title)).toContain('Software Engineer III')
    expect(godaddy.segments.map(s => s.title)).toContain('Principal Software Engineer')
  })

  it('sorts rows by earliest segment start year', () => {
    const result = groupCareerByCompany(mockCareerData)
    expect(result[0].company).toBe('OfficeMax')
    expect(result[1].company).toBe('GoDaddy')
  })
})
