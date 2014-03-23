basePath = ''
basePath = 'base/' unless typeof window.__karma__ == 'undefined'
jasmine.getFixtures().fixturesPath = "#{basePath}spec/fixtures"
