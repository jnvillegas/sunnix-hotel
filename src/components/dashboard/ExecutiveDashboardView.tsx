'use client';

import React from 'react';
import type { HabitacionCardData } from '@/types';
import { ExecutiveHeroHeader } from './ExecutiveHeroHeader';
import { ExecutiveKPICards } from './ExecutiveKPICards';
import { ExecutiveMiniRack } from './ExecutiveMiniRack';
import { ExecutiveAlertsTimeline } from './ExecutiveAlertsTimeline';
import { ExecutiveTurnoFinanceSummary } from './ExecutiveTurnoFinanceSummary';

interface ExecutiveDashboardViewProps {
  initialRooms: HabitacionCardData[];
}

export function ExecutiveDashboardView({ initialRooms }: ExecutiveDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header Hero con accesos directos */}
      <ExecutiveHeroHeader />

      {/* 2. KPIs Ejecutivos en vivo */}
      <ExecutiveKPICards />

      {/* 3. Mini-Rack táctico de ocupación */}
      <ExecutiveMiniRack rooms={initialRooms} />

      {/* 4. Alertas operativas prioritarias y Feed de actividad reciente */}
      <ExecutiveAlertsTimeline />

      {/* 5. Resumen financiero y de caja del turno */}
      <ExecutiveTurnoFinanceSummary />
    </div>
  );
}
