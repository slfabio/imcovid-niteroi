import { Component, OnInit } from '@angular/core';
import bd from '../assets/dados/dados.json';
import { Medida } from './medida';
import { Indicador } from './indicador';
import { Estagio } from './estagio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Indicadores de Monitoramento da COVID-19 em Niterói';
  public medidas: Medida[];
  public estagio: Estagio;
  public dtAtualizacao: string;
  public fonteDados = [];

  public inicio = '';
  public indicadores = '';
  public dados = '';
  public exibeDecreto = false;


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
    this.acessar('inicio');
  }

  public acessar(pagina: string): void {
    this.inicio = '';
    this.indicadores = '';
    this.dados = '';
    if ('inicio' === pagina) {
      this.inicio = 'active';
      return;
    }
    if ('indicadores' === pagina) {
      this.exibeDecreto = false;
      this.indicadores = 'active';
      return;
    }
    if ('dados' === pagina) {
      this.dados = 'active';
      return;
    }
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
