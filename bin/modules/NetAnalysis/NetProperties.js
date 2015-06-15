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


    // Ostatni analizowany stan grafu
    this.lastAnalyzedState = null;

    // graf pokrycia - scalamy węzły, które zwiększają tylko  1 miejsce do nieskończoności?
    // graf osiągalności - bez symbolu nieskończoności, sklejone duplikaty

    this.PTNgraph = null;
    this.CoverabilityGraph = null;
    this.graph = null;
    this.KLimitValue = null;
    this.AnalysisResults = null;


    this.KPlacesLimits = function()
    {


        /* TODO: funkcja ma zwracać k-ograniczoność każdego wierzchołka


         */
        var vertices = this.graph.GetVertices();
        var limits = {};
        var tmp = vertices[0].getState();
        var vert = vertices[0];
        //console.log("First state = " + tmp);
        for(var i in  tmp)
        {
            //console.log("i = "  + i);
            if (i !== null) limits[i] = 0;
        }
        /*
        for (var i = 0; i < limits.length; i++) {
            if (limits[i] == null) {
                limits.splice(i, 1);
                i--;
            }}

    */
        //console.log("!!!!");
        //console.log(vertices);
        //console.log(limits);//


        for (var v in vertices) // v to indeks a nie obiekt!!!
        {
            var state = vertices[v].getState();
            //var tmp = 0;
           //console.log("State : " + state);

            for(var m in state)
            {
               if (state[m] > limits[m])
               {
                   limits[m] = state[m];
               }
            }

        }

        //for (var i in limits)
        //{
        //    if(limits[i] === Infinity) limits[i] = 'Inf';
        //}
        return limits;
    };


    this.KLimit = function (LimitsVector)
    {
        var maxK = 0;
        for(var m in LimitsVector)
        {
            tmp = LimitsVector[m];
            ////("m =" + m + ", tmp = " + tmp + ", maxK = " + maxK);
            if (tmp > maxK) maxK = tmp;
        }
        //console.log("Maxx 2 " + maxK);
        return maxK;
        /*
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
            ////("State : " + state);

            for(var m in state)
            {
                tmp = Math.max(state[m]);
                ////("m =" + m + ", tmp = " + tmp + ", maxK = " + maxK);
                if (tmp > maxK) maxK = tmp;
            }

        }
        ////("Finallly, maxK = " + maxK);
        return maxK; // funkcja może zwrócić nieskończoność!!!
        // TODO: sprawdzić obliczanie max
        //this.KLimitValue = maxK;
        */
    };

    this.isSecure = function (K) {
        // sieć jest bezpieczna, jeśli jest 1-ograniczona
        return (K == 1);
    };
    this.isUnlimited = function (K) {
        // sieć jest bezpieczna, jeśli jest 1-ograniczona
        return (K == Infinity);
    };


        this.isConservative = function (givenVector) { // TODO: Potrzebuję do testu sieci, w której nie pojawiają się nieskończoności w grafie pokrycia
        // JEŚLI CoverabilityGraph.isConservative = true - sprawdź:
        // Jeśli false- zwróc false
        // TODO: czy takie rozwiazanie z argumentem domyślnym dla funkcji jest ok?
        //TODO: co powinniśmy zwrócić użytkownikowi w przypadku podania wektora wag o złej długości
        //TODO: jak użytkownik poda wektor (przycisk + osobne okienko dialogowe?)
        var vertices = this.graph.GetVertices();
            var weightsVector = [];
        //console.log("Vertices in coverability graph = " + Object.keys(vertices).length);
        if(Object.keys(vertices).length === 1)
        // jeśli graf pokrycia ma jeden wierzchołek to sieć jest martwa -> nie jest zachowawcza
        {
            return false;
        }

        var places = this.PTNgraph.getPlaces();

            for (var t in places)
            {
                weightsVector[places[t].id] = places[t].getWeight();
            }

        var sums = [];
        var sampleState = vertices[0].getState();

        //console.log("GIVEN VECTOR = " + givenVector);
        //if ( (givenVector instanceof Array) && (givenVector.length === 0)) {
        //if(givenVector === undefined){
        //
        //    for(var i in sampleState) // DANGER!!!!
        //
        //    {
        //        console.log("i = " + i);
        //        weightsVector[i] = 1;
        //    }
        //
        //}
        //else
        //{
        //    var index = 0;
        //    for(var i in sampleState)
        //        // TODO: dlaczego nie mogę pobrać rozmiaru stanu metodą size/length?
        //    {
        //        weightsVector[i] = givenVector[index];
        //        index++;
        //    }
        //}
        console.log("weightsVector: " + weightsVector);

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
                console.log("m = "  + m + " State[m] = " + state[m] + ", waga[m] = " + weightsVector[m] )
                sum  +=  state[m] * weightsVector[m];
            }
            if(sum === Infinity) return false;
            console.log("Sum in state " + m + " = " + sum);
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

        if(Object.keys(vertices).length === 1)
        // jeśli graf pokrycia ma jeden wierzchołek to sieć jest martwa -> nie jest odwracalna
        {
            return false;
        }
        var root = this.CoverabilityGraph.treeRoot;
        //("Root: " + root.id);
        var result = false;
        for(v in vertices)
        {
            vv = vertices[v];
            if(vv.id !== root.id)
            {
                //("Vertex: " + vv.id);
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
            //console.log(vv);
            //console.log(vv.id);
            //console.log("LABEL? : " + vv.); // ta etykieta tego nie oznacza!!
            if(vv.getDead())
            {
                console.log("!!!!" + vv.id + "," + vv.getDead());
                for (var i in vv.getState())
                {
                    console.log(vv.getState()[i]);
                }
                return false;
            } // jeśli którykolwiek stan grafu pokrycia jest martwy

            // to znaczy że sieć może utknąć w martwym punkcie (zakleszczyć się) -> nie jest żywotna
        }
        return true;
    };

    /*
     Żywotność przejścia  oznacza,  że  zawsze  ma  on szansę ponownie być aktywne.
     Przejście  t  nazywamy  martvvym  ( LO - zywym ) .  jeżeli  przejscie  t  nie  występuje
     żadnym ciągu przejsć należących  do  zbioru  L(M0)
     */

    //var function {}
    // jeśli z jakiegoś stanu istnieje ścieżka w grafie pokrycia, która prowadzi do stanu martwego - sieć nie jest ani żywa ani martwa
    // jeśli nie ma drogi do stanu martwego, to sieć jest żywa
    // funkcja zwracająaca
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
            //("Edge = " + e.data.transition);
        }
        //("TransitionsCover : " + transitionsCover);
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
                transitionsVitality.push({transition: transitionsPTN[p].getId(), vitality: 'L0'});
                // TODO: sprawdzić, czy można wrócić do przejścia z dowolnego miejsca
                // Dijkstra ze sprawdzaniem krawędzi
            }
            else if  (counts[transitionsPTN[p]])
            {
                transitionsVitality.push({transition: transitionsPTN[p].getId(), vitality: 'L1'});
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

    this.tmpFun = function()
    {
        console.log("!!!XXX!!!");
        var vertices = this.PTNgraph.getTransitions()
        for (var v in vertices)
        {
            console.log(v + ", " + vertices[v].getLabel());
        }
    };


    this.Analyze = function(PTNGraph)
    {
        if (!this.hasStateChanged(PTNGraph.getState())) {
            return this.AnalysisResults;
        }
        this.SetGraph(PTNGraph);


        var Limits  =  this.KPlacesLimits();
        var K = this.KLimit(Limits);

        for (var i in Limits) {
            if (Limits[i] === Infinity) {
                Limits[i] = 'Inf';
            }
        }

        this.AnalysisResults = {
            "PlacesLimits" : Limits,
            "NetLimit": (Infinity !== K ? K : 'Unlimited'),
            "Securability" : this.isSecure(K),
            "Unlimited" : this.isUnlimited(K),
            "Conservative": this.isConservative(),
            "Reversable" : this.isReversable(),
            "Vital" : this.isVital(),
            "Transitions vitality" : this.getTransitionsVitality()
        };
        var  matrix = this.PTNgraph.getMatrixRepresentation();
        this.lastAnalyzedState = PTNGraph.getState();
        this.tmpFun();

        return this.AnalysisResults;
    };

    this.serializeCoverabilityGraph = function(PTNGraph) {
        if (this.hasStateChanged(PTNGraph.getState())) {
            this.Analyze(PTNGraph);
        }

        return this.CoverabilityGraph.serializeCoverabilityGraph();
    };

    this.serializeReachabilityGraph = function(PTNGraph) {
        if (this.hasStateChanged(PTNGraph.getState())) {
            this.Analyze(PTNGraph);
        }

        return this.CoverabilityGraph.serializeReachabilityGraph();
    };

    this.SetGraph = function(PTNGraph)
    {
        this.PTNgraph = PTNGraph;
        this.CoverabilityGraph = new CoverabilityGraph(PTNGraph);
        this.graph = this.CoverabilityGraph.graph;
    };

    this.hasStateChanged = function(state) {
        return !state.isEqual(this.lastAnalyzedState);
    };

    return this;

}

module.exports = NetProperties;