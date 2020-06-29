import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import bd from '../assets/dados/dados.json';
import { Medida } from './modelos/medida';
import { Indicador } from './modelos/indicador';
import { Estagio } from './modelos/estagio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static readonly INICIO = 1;
  public static readonly INDICADORES = 2;
  public static readonly DADOS = 3;

  title = 'Indicadores de Monitoramento da COVID-19 em Niterói';
  public medidas: Medida[];
  public estagio: Estagio;
  public dtAtualizacao: string;
  public fonteDados = [];

  @ViewChild('inicio') divInicio: ElementRef; 
  @ViewChild('indicadores') divIndicadores: ElementRef; 
  @ViewChild('dados') divDados: ElementRef; 

  public exibeDecreto = false;
  public divAtivo = AppComponent.INICIO;


  view: any[] = [150, 200];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  timeline = true;
  colorScheme = {domain: ['#8cf06e']};

  private inicializarMedida(medida: Medida, id: number) {
    medida.id = id;
    medida.exibeGraficos = true;
    medida.graficoPercentual = false;
  }

  private inicializarIndicador(indicador, graficoNumerador, graficoIndice, corSinal) {
    indicador.graficoNumerador = graficoNumerador;
    indicador.graficoIndice = graficoIndice;
    indicador.corSinal = corSinal;
  }

  ngOnInit(): void {
    let idMedida = 0;
    bd.medidas.forEach(medida => {
      this.inicializarMedida(medida, idMedida++);
      medida.indicadores.forEach(indicador => {
        const graficoNumerador = [];
        const graficoIndice = [];
        const corSinal = [];
        indicador.serie.forEach(s => {
          const label = s.dia.substring(0, 5);
          graficoNumerador.push({name: label, value: s.numerador});
          graficoIndice.push({name: label, value: s.indice});
          corSinal.push({name: label, value: this.obterCorSinal(s.sinal)});
        });
        this.inicializarIndicador(indicador, graficoNumerador, graficoIndice, corSinal);
      });
    });
    this.medidas = bd.medidas;
    this.dtAtualizacao = bd.atualizacao;
    this.fonteDados = bd.dados;

    this.estagio = bd.estagio;
    this.estagio.graficoIndice = [];
    this.estagio.corSinal = [];
    this.estagio.serie.forEach(s => {
      const label = s.dia.substring(0, 5);
      this.estagio.graficoIndice.push({name: label, value: s.indice});
      this.estagio.corSinal.push({name: label, value: this.obterCorSinal(s.sinal)});
    });

    this.definirGraficoOcupacaoLeitos(this.medidas[this.medidas.length - 1]);
  }

  public cont = 0;
  public cont1 = 0;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const topInicio = Math.trunc(Math.abs(this.divInicio.nativeElement.getBoundingClientRect().top));
    const topIndicadores = Math.trunc(Math.abs(this.divIndicadores.nativeElement.getBoundingClientRect().top));
    const topDados = Math.trunc(Math.abs(this.divDados.nativeElement.getBoundingClientRect().top));
    if (topInicio < 50 || topIndicadores < 50 || topDados < 50) {
      if (topIndicadores < 50) {
        this.divAtivo = AppComponent.INDICADORES;
        return;
      }
      if (topDados < 50) {
        this.divAtivo = AppComponent.DADOS;
        return;
      }
      this.divAtivo = AppComponent.INICIO;
    }
  }

  public acessar(pagina: Element): void {
    pagina.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  private obterCorSinal(sinal: string): string {
    if (sinal === 'Alerta') {
      return '#fefbd8';
    }
    if (sinal === 'Alerta Máximo') {
      return '#ffff00';
    }
    if (sinal === 'Atenção Máxima') {
      return '#ff8c00';
    }
    if (sinal === 'Grave') {
      return '#ff0000';
    }
    if (sinal === 'Altíssimo Risco') {
      return '#9400d3';
    }
    return '';
  }

  public expandir(exibe: boolean): void {
    this.medidas.forEach(m => m.exibeGraficos = exibe);
  }

  public exibeGraficos(idMedida: number): boolean {
    return this.medidas[idMedida].exibeGraficos;
  }

  public exibirDecreto(): void {
    this.exibeDecreto = true;
  }

  public exibirGraficos(medida: Medida): void {
    medida.exibeGraficos = !medida.exibeGraficos;
  }

  private definirGraficoOcupacaoLeitos(medida: Medida) {
    medida.graficoPercentual = true;
    medida.indicadores.forEach(indicador => {
      this.alterarGraficoIndice(indicador);
    });

  }

  private alterarGraficoIndice(indicador: Indicador) {
    const graficoPercentual = [];
    indicador.serie.forEach(s => {
      indicador.corSinal.push({name: 'Ocupados', value: this.obterCorSinal(s.sinal)});
      graficoPercentual.push(
        {
          name: s.dia.substring(0, 5),
          series: [
            {
              name: 'Ocupados',
              value: s.numerador
            },
            {
              name: 'vagos',
              value: Number(s.denominador) - Number(s.numerador)
            }
          ]
        });
    });
    indicador.graficoIndice = graficoPercentual;
  }
}
