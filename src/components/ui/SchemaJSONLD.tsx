import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export const SchemaJSONLD: React.FC<SchemaProps> = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};
