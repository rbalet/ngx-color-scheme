import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { ColorSchemeToggleComponent } from './color-scheme-toggle.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ColorSchemeToggleComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
