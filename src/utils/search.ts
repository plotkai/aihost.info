import { McpServer, FilterState } from '../types/mcp';

export function filterAndSearchServers(servers: McpServer[], filter: FilterState): McpServer[] {
  const query = filter.searchQuery.trim().toLowerCase();

  return servers.filter((server) => {
    // 1. Text Search Filter
    if (query) {
      const nameMatch = server.name.toLowerCase().includes(query);
      const descMatch = server.shortDescription.toLowerCase().includes(query) ||
        server.longDescription.toLowerCase().includes(query);
      const tagMatch = server.tags.some((t) => t.toLowerCase().includes(query));
      const companyMatch = server.company.toLowerCase().includes(query) ||
        server.author.toLowerCase().includes(query);
      const categoryMatch = server.category.toLowerCase().includes(query);
      const toolMatch = server.tools?.some((tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );

      if (!nameMatch && !descMatch && !tagMatch && !companyMatch && !categoryMatch && !toolMatch) {
        return false;
      }
    }

    // 2. Category Filter
    if (filter.selectedCategories.length > 0) {
      if (!filter.selectedCategories.includes(server.category)) {
        return false;
      }
    }

    // 3. Demography / Region Filter
    if (filter.selectedRegions.length > 0) {
      if (!filter.selectedRegions.includes(server.demography.region)) {
        return false;
      }
    }

    // 4. Transport Filter
    if (filter.selectedTransports.length > 0) {
      const hasTransport = server.transport.some((t) => filter.selectedTransports.includes(t));
      if (!hasTransport) {
        return false;
      }
    }

    // 5. Hosting Filter
    if (filter.selectedHostings.length > 0) {
      if (!filter.selectedHostings.includes(server.hosting)) {
        return false;
      }
    }

    // 6. Verified Badge Filter
    if (filter.verifiedOnly && !server.verified) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filter.sortBy === 'stars') {
      return (b.stars || 0) - (a.stars || 0);
    }
    if (filter.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (filter.sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (filter.sortBy === 'tools') {
      return (b.tools?.length || 0) - (a.tools?.length || 0);
    }
    return 0;
  });
}
