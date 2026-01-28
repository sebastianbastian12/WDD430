import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdownMenu]'
})

export class appDropdownMenuDirective{
    @HostBinding('class.open') isOpen = false;
    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
    }
}