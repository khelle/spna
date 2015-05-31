/**
 * Created by Rael on 2015-05-16.
 */

var CoverabilityGraph = require('../CoverabilityGraph');
var State = require('../State');

function NetProperties() {


// TODO: metoda, która przejdzie po wszystkich węzłach grafu pokrycia (DFS, BFS)
// TODO: zrobić Dijkstrę dla grafu pokrycia
// TODO: wybrać, która metoda przechodzenia grafu jest najlepsza
// TODO: metoda, która znajduje ścieżkę/ciąg wierzchołków pomiędzy dwoma wierzchołkami w grafie pokrycia
// jak dostajemy graf pokrycia do analizy?




    // graf pokrycia - scalamy węzły, które zwiększają tylko  1 miejsce do nieskończoności?
    // graf osiągalności - bez symbolu nieskończoności, sklejone duplikaty

   this.PTNgraph = null;
   this.CoverabilityGraph = null;
   this.graph = null;

    this.KLimit = function ()
    {
        // sieć jest k-ograniczona, jeśli istnieje liczba naturalna k,
        // taka że w każdym miejscu nigdy nie będzie więcej niż (k) kropek.

        // przeiteruj po tablicy wierzchołków w grafie pokrycia, które są stanami
            //wybierz maksymalną wartość z tablicy stanów i ją zwróć (w szczególności inf)
            //
        // jeśli któryś z węzłów ma więcej niż k znaczników zwróć fałsz
        var vertices = this.graph.GetVertices();
        var maxK = 0;
        for (var v in vertices) // v to indeks a nie obiekt!!!
        {
            var state = vertices[v].getState();
            var tmp = 0;
            //console.log("State : " + state);

            for(var m in state)
            {
                tmp = Math.max(state[m]);
                //console.log("m =" + m + ", tmp = " + tmp + ", maxK = " + maxK);
                if (tmp > maxK) maxK = tmp;
            }

         }
        //console.log("Finallly, maxK = " + maxK);
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


    this.isConservative = function (weightsVector) { // TODO: Potrzebuję do testu sieci, w której nie pojawiają się nieskończoności w grafie pokrycia
        // JEŚLI CoverabilityGraph.isConservative = true - sprawdź:
        // Jeśli false- zwróc false
        // TODO: czy takie rozwiazanie z argumentem domyślnym dla funkcji jest ok?
        //TODO: co powinniśmy zwrócić użytkownikowi w przypadku podania wektora wag o złej długości
        //TODO: jak użytkownik poda wektor (przycisk + osobne okienko dialogowe?)
        var vertices = this.graph.GetVertices();
        var sums = [];
        var sampleState = undefined;


        if (typeof(weightsVector)==='undefined'){
            weightsVector = [];
            // TODO: jak mogę pobrać pierwszy stan (pierwszy element tablicy)?
            for (var s in vertices)
            {
                sampleState = vertices[s].getState();
                break;
            }
            for(var i in sampleState)
            // TODO: dlaczego nie mogę pobrać rozmiaru stanu metodą size/length?
            {
                weightsVector.push(1);
            }
            //console.log("weightsVector: " + weightsVector);
        }

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
                sum  +=  state[m] * weightsVector[m];
            }
            if(sum === Infinity) return false;
            //console.log("Sum in state " + i + " = " + sum);
            sums.push(sum);
        }
        console.log("Sums of markers in each state: " + sums);
        for (var s = 0; s < sums.length - 1; s++)
        {
            if( (sums[s+1]-sums[s]) !== 0) return false;
        }
        return true;
    };


    this.isReversable = function () {
       /*
        Sieć N  jest  odwracalna  wtedy  i  tylko  wtedy  ,  gd  wszytkie  znakowania  są jej  znakowaniami  własnymi.
        Znakowanie  M  sieci  N  nazywamy  znakowaniem  własnym jeżeli  jest  osiągalne z  dowolnego  znakowania


        Sieć N  nazywamy  odwracalną, jeżeli  znakowanie  początkowe jest  osiągalne
        z  każdego znakowania.

        Dla każdego wierzchołka w grafie pokrycia sprawdź, czy da się dojść do niego z każde
        */
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

    /*
     Żywotność przejścia  oznacza,  że  zawsze  ma  on szansę ponownie być aktywne.
     Przejście  t  nazywamy  martvvym  ( LO - zywym ) .  jeżeli  przejscie  t  nie  występuje
     żadnym ciągu przejsć należących  do  zbioru  L(M0)
      */

    this.getTransitionsVitality = function () {

        /*
        Zwróć tablicę obiektów postaci { transitionName: 't0', vitality: 'L0' }
         */
        var transitionsPTN = this.PTNgraph.getTransitions();
        var edges = this.graph.GetEdges();

        var transitionsCover = [];
        for(var j in edges){
            var e = edges[j];
            transitionsCover.push(e.data.transition);
            console.log("Edge = " + e.data.transition);
        }
        console.log("TransitionsCover : " + transitionsCover);
        var counts = {};

        // mapa - nazwa przejścia : ilość wystąpienia przejścia w grafie pokrycia
        for(var i = 0; i< transitionsCover.length; i++) {
            var num = transitionsCover[i];
            counts[num] = counts[num] ? counts[num]+1 : 1;
        }

        var transitionsVitality = [];
        for(var p in transitionsPTN)
        {
            if(counts[transitionsPTN[p]] === undefined)
            {
                transitionsVitality.push({transitionName: transitionsPTN[p].label, vitality: 'L0'});
            }
            else  (counts[transitionsPTN[p]] )
            {
                transitionsVitality.push({transitionName: transitionsPTN[p].label, vitality: 'L1'});
            }
            /*
            TODO: sprawdzenie innych stopni żywotności

             Przejście t  sieci  N  jest L2 - żywe  wtedy i tylko  wtedy  , gdy dla dowolnej  liczby
             k  istnieje  droga  w  grafie  osiągalności/pokrycia,  w  której  co  najmniej  k  raz  występuje  łuk
             z  etykietą t.

             L3 - musi być pętla, w której jedna z krawędzi ma etykietę t (wykrywanie pętli DFS)
             L4 -  Jeżeli  graf osiągalności jest  grafem  silnie  spójnym  i  występuje  w  nim  łuk z  etykietą  t,
             to  przejście t jest  żywe ( L4 - żywe) .
             */



        }
        //console.log(transitionsVitality);

        return transitionsVitality;

    };

    this.Analyze = function(PTNGraph)
    {
        this.SetGraph(PTNGraph);

        return {
            "NetLimit": this.KLimit(),
            "Conservative": this.isConservative(),
            "Reversable" : this.isReversable(),
            "Vital" : this.isVital()
        };
    };

    this.SetGraph = function(PTNGraph)
    {
        this.PTNgraph = PTNGraph;
        this.CoverabilityGraph = new CoverabilityGraph(PTNGraph);
        this.graph = this.CoverabilityGraph.graph;
    };

    return this;

}

module.exports = NetProperties;