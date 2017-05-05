import { Component, ElementRef, Input, OnInit, Optional, Renderer, SkipSelf } from '@angular/core';
import { Http } from '@angular/http';

import { SvgIconRegistryService } from './svg-icon-registry.service';


@Component({
	selector: 'svg-icon',
	styles: [ ':host { display:inline-block; }' ],
	template: '<ng-content></ng-content>'
})

export class SvgIconComponent implements OnInit {
	@Input() src:string;

	constructor(private element:ElementRef, private renderer:Renderer,
		private iconReg:SvgIconRegistryService) {
	}

	ngOnInit() {
		this.loadSvg();
	}

	private loadSvg() {
		this.iconReg.loadSvg(this.src).subscribe(svg => {
			this.setSvg(svg);
		});
	}

	private setSvg(svg:SVGElement) {
		const icon = <SVGElement>svg.cloneNode(true);
		let elem = this.element.nativeElement;
		elem.innerHTML = '';
		this.renderer.projectNodes(elem, [icon]);
	}
}

export function SVG_ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry:SvgIconRegistryService, http:Http) {
	return parentRegistry || new SvgIconRegistryService(http);
}

export const SVG_ICON_REGISTRY_PROVIDER = {
	provide: SvgIconRegistryService,
	deps: [ [new Optional(), new SkipSelf(), SvgIconRegistryService], Http],
	useFactory: SVG_ICON_REGISTRY_PROVIDER_FACTORY
}