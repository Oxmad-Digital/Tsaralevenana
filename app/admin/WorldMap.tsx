"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getCountryNumericId } from "@/lib/countries";
import styles from "./admin.module.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Country = { code: string; name: string; count: number };

export default function WorldMap({ countries }: { countries: Country[] }) {
  const byNumericId = useMemo(() => {
    const map = new Map<string, Country>();
    for (const country of countries) {
      const numericId = getCountryNumericId(country.code);
      if (numericId) map.set(numericId, country);
    }
    return map;
  }, [countries]);

  const maxCount = Math.max(1, ...countries.map((c) => c.count));

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Origine géographique des visiteurs</h2>
      {countries.length === 0 ? (
        <p className={styles.emptyState}>Pas encore de données.</p>
      ) : (
        <div className={styles.worldMap}>
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            className={styles.worldMapSvg}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const match = byNumericId.get(String(geo.id));
                  const fillOpacity = match ? 0.25 + 0.75 * (match.count / maxCount) : 1;
                  const geoName =
                    (geo.properties as { name?: string } | null)?.name ?? "";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      className={styles.worldMapCountry}
                      fill={match ? "var(--color-gold)" : "var(--color-bg-alt)"}
                      fillOpacity={fillOpacity}
                      stroke="var(--color-bg)"
                      strokeWidth={0.5}
                    >
                      <title>
                        {match
                          ? `${match.name} : ${match.count} vue${match.count > 1 ? "s" : ""}`
                          : geoName}
                      </title>
                    </Geography>
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          <div className={styles.worldMapLegend}>
            <span>Moins de visites</span>
            <span className={styles.worldMapLegendBar} />
            <span>Plus de visites</span>
          </div>
        </div>
      )}
    </section>
  );
}
