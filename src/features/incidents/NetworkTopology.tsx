import type { ReactNode } from 'react';

export function NetworkTopology() {
  return <section className="network-topology" aria-labelledby="network-topology-title">
    <h3 id="network-topology-title">Topologia da rede</h3>
    <p className="topology-note">Desenho conceitual e anonimizado. Os grupos representam funções, sem indicar quantidades exatas de portas, equipamentos ou cabos.</p>
    <fieldset className="topology-picker">
      <legend>Comparar a organização das conexões</legend>
      <label><input type="radio" name="network-topology" value="before" defaultChecked /> Antes</label>
      <label><input type="radio" name="network-topology" value="after" /> Depois</label>
    </fieldset>
    <div className="topology-before"><TopologyTree after={false} /></div>
    <div className="topology-after"><TopologyTree after /></div>
  </section>;
}

function TopologyTree({ after }: { after: boolean }) {
  const administration = <Node name="Pontos administrativos">
    {after ? 'Os cabos das salas administrativas passaram a chegar diretamente ao switch principal.' :
      'Os pontos administrativos chegavam ao switch principal por meio de switches intermediários.'}
  </Node>;

  return <div className="topology-view">
    <h4>{after ? 'Depois da reorganização' : 'Antes da reorganização'}</h4>
    <ul className="topology-tree">
      <Node name="Switch principal" explanation={after ?
        'Recebe diretamente as conexões administrativas e mantém o uplink para vendas.' :
        'Concentra os uplinks para os switches intermediários administrativos e para vendas.'}>
        {after ? administration : <Node name="Switches administrativos intermediários"
          explanation="Ligavam as salas administrativas ao switch principal. Os equipamentos intermediários desnecessários foram retirados.">
          {administration}
        </Node>}
        <Node name={after ? 'Switches mantidos em vendas' : 'Switch da sala de vendas'}
          explanation={after ? 'Os switches menores necessários continuaram atendendo à sala de vendas.' :
            'O switch rastreado tinha um uplink do switch principal e conexões para um computador de vendas e para o almoxarifado.'}>
          <Node name="Computador de vendas">Um dos destinos atendidos pelo switch rastreado.</Node>
          <Node name="Ponto do almoxarifado">A conexão deste ponto foi confirmada no teste controlado de desconexão.</Node>
        </Node>
      </Node>
    </ul>
    {after && <p className="topology-note">Cabos e pontos rastreados foram identificados com etiquetas simples.</p>}
  </div>;
}

function Node({ name, explanation, children }: {
  name: string;
  explanation?: string;
  children: ReactNode;
}) {
  return <li>
    <details>
      <summary>{name}</summary>
      <p>{explanation ?? children}</p>
    </details>
    {explanation && <ul>{children}</ul>}
  </li>;
}
