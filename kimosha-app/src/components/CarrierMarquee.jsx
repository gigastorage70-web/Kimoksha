export default function CarrierMarquee() {
  const carriers = [
    '📡 Tier-1 Operator Interconnect',
    '🌍 Middle East & GCC Direct Routes',
    '🇪🇺 European Telco Exchange (Equinix FR2)',
    '🇺🇸 North America SS7 SIGTRAN',
    '🌏 APAC Low-Latency Carrier Core',
    '🇿🇦 Africa Wholesale SMS Termination',
  ];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {carriers.concat(carriers).map((carrier, index) => (
          <span key={index} className="carrier-pill">
            {carrier}
          </span>
        ))}
      </div>
    </div>
  );
}
