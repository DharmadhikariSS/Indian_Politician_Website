const fs = require('fs');
const pages = ['Home', 'Browse', 'PoliticianProfile', 'Compare', 'Map', 'Rankings', 'Search', 'About'];

pages.forEach(p => {
  const content = `import React from 'react';

const ${p} = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-heading mb-4">${p}</h1>
      <p className="text-text-secondary">Content coming soon...</p>
    </div>
  );
};

export default ${p};
`;
  fs.writeFileSync(`src/pages/${p}.tsx`, content);
});
