import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  mixinColor,
  CanColor,
  DtProgressChange,
  HasProgressValues,
  mixinHasProgress,
  Constructor,
} from '@dynatrace/angular-components/core';

export type DtBarIndicatorChange = DtProgressChange;

export type DtBarIndicatorThemePalette = 'main' | 'recovered' | 'error';

export class DtBarIndicatorBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtBarIndicator =
  mixinHasProgress(mixinColor<Constructor<DtBarIndicatorBase>, DtBarIndicatorThemePalette>(DtBarIndicatorBase, 'main'));

@Component({
  moduleId: module.id,
  selector: 'dt-bar-indicator',
  templateUrl: 'bar-indicator.html',
  styleUrls: ['bar-indicator.scss'],
  exportAs: 'dtBarIndicator',
  host: {
    'class': 'dt-bar-indicator',
    '[class.dt-bar-indicator-end]': 'align == "end"',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
})
export class DtBarIndicator extends _DtBarIndicator implements CanColor<DtBarIndicatorThemePalette>, HasProgressValues {

  @Input() align: 'start' | 'end' = 'start';

  @Output()
  readonly valueChange = new EventEmitter<DtBarIndicatorChange>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef) {
    super(elementRef);
  }

  /**
   * Updates all view parameters
   * @internal
   */
  _updateValues(): void {
    super._updateValues();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Emits valueChange event if the value of the bar-indicator is updated
   * @internal
   */
  _emitValueChangeEvent(oldValue: number, newValue: number): void {
    this.valueChange.emit({ oldValue, newValue });
  }
}