/**
 * Created by Rael on 2015-05-16.
 */

var CoverabilityGraph = require('../CoverabilityGraph');
var State = require('../State');
function NetProperties(PTNGraph) {


// TODO: metoda, która przejdzie po wszystkich węzłach grafu pokrycia (DFS, BFS)
// TODO: zrobić Dijkstrę dla grafu pokrycia
// TODO: wybrać, która metoda przechodzenia grafu jest najlepsza
// TODO: metoda, która znajduje ścieżkę/ciąg wierzchołków pomiędzy dwoma wierzchołkami w grafie pokrycia
// jak dostajemy graf pokrycia do analizy?




    // graf pokrycia - scalamy węzły, które zwiększają tylko  1 miejsce do nieskończoności?
    // graf osiągalności - bez symbolu nieskończoności, sklejone duplikaty

   this.PTNgraph = PTNGraph;
   this.CoverabilityGraph = CoverabilityGraph(PTNGraph);
   this.graph = this.CoverabilityGraph.graph;


    this.KLimit = function ()
    {
        // sieć jest k-ograniczona, jeśli istnieje liczba naturalna k,
        // taka że w każdym miejscu nigdy nie będzie więcej niż (k) kropek.

        // przeiteruj po tablicy wierzchołków w grafie pokrycia, które są stanami
            //wybierz maksymalną wartość z tablicy stanów i ją zwróć (w szczególności inf)
            //
        // jeśli któryś z węzłów ma więcej niż k znaczników zwróć fałsz
        var vertices = this.graph.GetVertices();
        var maxK = 1;
        for (var v in vertices) // v to indeks a nie obiekt!!!
        {
            var state = vertices[v].getState();
            var tmp = 0;
            for(var m in state)
            {
                tmp = Math.max(state[m]);
            }
            if (tmp > maxK) maxK = tmp;
         }
        return maxK; // funkcja może zwrócić nieskończoność!!!
        // TODO: sprawdzić obliczanie max
    };

    this.isSecure = function () {
        // sieć jest bezpieczna, jeśli jest 1-ograniczona
        if (this.KLimit()==1) return true;
        else return false;
    };
    this.isUnLimited = function () {
        // sieć jest bezpieczna, jeśli jest 1-ograniczona
        if (this.KLimit()==Infinity) return true;
        else return false;
    };


    this.isConservative = function () { // TODO: Potrzebuję do testu sieci, w której nie pojawiają się nieskończoności w grafie pokrycia
        // JEŚLI CoverabilityGraph.isConservative = true - sprawdź:
        // Jeśli false- zwróc false

        if(!graph.isConservative)
        {
            return false;
        }
        var sum = null;
        var sumPrev = null;

        // sieć jest zachowawcza, jeśli  łączna liczba znaczników
        // w sieci pozostaje stała dla każdego znakowania
        //osiągalnego ze  znakowania  początkowego.

        // policz sumę znaczników w każdym z wierzchołkó
        // pamiętaj sumę w poprzednim
        // jeśli suma

        // dla każdego węzłu grafu pokrycia zsumuj ilość znaczników
        // we wszystkich getState, klasa State;

        // jeśli gdziekolwiek w grafie pokrycia pojawi się nam symbol nieskończnoności, to sieć nie jest zachowawcza
        var vertices = this.graph.GetVertices();
        var sums = [];

        for(var i in vertices)
        {
            var state = vertices[i].getState();
            var sum = 0;
            for(var m in state)
            {
                sum  +=  state[m];
            }
            console.log(sum);
            sums.push(sum);
        }
        console.log(sums);
        for (var s in sums)
        {
            if( (sums[i]-sums[i-1]) !== 0) return false;
        }
        return true;
    };

    this.isReversable = function () {
        // sieć jest odwracalna, jeśli z każdego znakowania M, stan początkowy M0 jest z niego osiągalny
        // sprawdzić, czy dla każdego węzła z grafu osiągalności (pokrycia?) istnieje ścieżka prowadząca do korzenia grafu?

        // Przejdź po wszystkich węzłach grafu pokrycia, dla węzła i:
            // Sprawdź, czy istnieje ścieżka prowadząca z powrotem
        var vertices = this.graph.GetVertices();
        var root = this.CoverabilityGraph.treeRoot;
        console.log("Root: " + root.id);
        for(v in vertices)
        {
            vv = vertices[v];
            if(vv.id !== root.id)
            {
                console.log("Vertex: " + vv.id);
                if(!this.CoverabilityGraph.Dijkstra(vertices[v], root)) return false;
            }
        }
        return true;

    };

    this.isVital = function () { //TODO: czy taka definicja żywotności wystarcza?
        // musimy udowodnić, że dla dowolnego stanu, dla każdego z przejść istnieje sekwencja odpaleń innych przejść, która
        // uaktywnia to przejście
        // innymi słowy - w sieci nie  może być zakleszczeń
        // - niemożliwości odpalenia jakiegokolwiek przejścia

        // Przejdź po wszystkich stanach (węzłąch) w grafie pokrycia:
            // Przeiteruj po wszystkich przejściach w sieci :
            // znajdź sekwencję przejść, która uaktywnia to przejście

            // znajdź taką ścieżkę w grafie pokrycia, że kończy się tym przejściem
            // znajdź taki ciąg wierzchołków, że ostatni wierzchołek w ciągu ma krawędź wychodzącą będącą i-tym przejściem
    var vertices = this.graph.GetVertices();
        for(var v in vertices)
        {
            var vv = vertices[v];
            console.log(vv);
            console.log(vv.id);
            console.log(vv.getLabel());
            if(vv.getLabel() === State.DEAD ) return false; // jeśli którykolwiek stan grafu pokrycia jest martwy
            // to znaczy że sieć może utknąć w martwym punkcie (zakleszczyć się) -> nie jest żywotna
        }
        return true;
    };

    this.Analyze = function()
    {
        return {
            "NetLimit": this.KLimit(),
            "Conservative": this.isConservative(),
            "Reversable" : this.isReversable(),
            "Vital" : this.isVital()
        };
    };




    return this;

}

module.exports = NetProperties;