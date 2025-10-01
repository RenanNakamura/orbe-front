import {NgModule} from '@angular/core';
import {
    WidgetAnalyticsMessagesOverviewChart
} from './widget-analytics-messages-overview-chart';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {TranslateModule} from '@ngx-translate/core';
import {ChartModule} from '../chart.module';

@NgModule({
    declarations: [WidgetAnalyticsMessagesOverviewChart],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        ChartModule
    ],
    exports: [WidgetAnalyticsMessagesOverviewChart]
})
export class WidgetAnalyticsMessagesOverviewChartModule { }
