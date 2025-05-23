import { Route } from '@angular/router';
import { HomePage } from './home/home.page';
import { AnalyzePage } from './analyze/analyze.page';
import { AnalysesPage } from './analyses/analyses.page';

export const appRoutes: Route[] = [
  { path: '', component: HomePage },
  { path: 'analyze', component: AnalyzePage },
  { path: 'analyses', component: AnalysesPage },
];
