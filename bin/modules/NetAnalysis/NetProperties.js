/**
 * Created by Rael on 2015-05-16.
 */

//var CoverabilityGraph = require('./CoverabilityGraph');

function NetProperties() {


// TODO: metoda, która przejdzie po wszystkich węzłach grafu pokrycia (DFS, BFS)
// TODO: zrobić Dijkstrę dla grafu pokrycia
// TODO: wybrać, która metoda przechodzenia grafu jest najlepsza
// TODO: metoda, która znajduje ścieżkę/ciąg wierzchołków pomiędzy dwoma wierzchołkami w grafie pokrycia
// jak dostajemy graf pokrycia do analizy?




    // graf pokrycia - scalamy węzły, które zwiększają tylko  1 miejsce do nieskończoności?
    // graf osiągalności - bez symbolu nieskończoności, sklejone duplikaty

   // this.limit =

    this.isKLimited = function ()
        // sieć jest k-ograniczona, jeśli istnieje liczba naturalna k,
        // taka że w każdym miejscu nigdy nie będzie więcej niż (k) kropek.
    {
        // przeiteruj po tablicy wierzchołków w grafie pokrycia, które są stanami
            //wybierz maksymalną wartość z tablicy stanów i ją zwróć (w szczególności inf)
            //
        // jeśli któryś z węzłów ma więcej niż k znaczników zwróć fałsz


    };

    this.isSecure = function () {
        // sieć jest bezpieczna, jeśli jest 1-ograniczona
        if (thiisKLimited()==1) return true;
        else return false;
    };

    this.isConservative = function () {
        // JEŚLI CoverabilityGraph.isConservative = true - sprawdź:
        // Jeśli false- zwróc false

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

    };

    this.isReversable = function () {
        // sieć jest odwracalna, jeśli z każdego znakowania M, stan początkowy M0 jest z niego osiągalny
        // sprawdzić, czy dla każdego węzła z grafu osiągalności (pokrycia?) istnieje ścieżka prowadząca do korzenia grafu?

        // Przejdź po wszystkich węzłach grafu pokrycia, dla węzła i:
            // Sprawdź, czy istnieje ścieżka prowadząca z powrotem

    };

    this.isVital = function () {
        // musimy udowodnić, że dla dowolnego stanu, dla każdego z przejść istnieje sekwencja odpaleń innych przejść, która
        // uaktywnia to przejście
        // innymi słowy - w sieci nie  może być zakleszczeń
        // - niemożliwości odpalenia jakiegokolwiek przejścia

        // Przejdź po wszystkich stanach (węzłąch) w grafie pokrycia:
            // Przeiteruj po wszystkich przejściach w sieci :
            // znajdź sekwencję przejść, która uaktywnia to przejście

            // znajdź taką ścieżkę w grafie pokrycia, że kończy się tym przejściem
            // znajdź taki ciąg wierzchołków, że ostatni wierzchołek w ciągu ma krawędź wychodzącą będącą i-tym przejściem

    };



}