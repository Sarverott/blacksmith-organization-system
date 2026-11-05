# BOS - scrapnote from google keep

> PL:

### pomysły i noty

- projekty się mogą autocommitować co save

- lista funkcji w złotym zeszycie

- schemat działania w kalendarzu 2019

- GIMP: zbindować historię z svn; co zmianę automatycznie ctrl+s i commit z notką "nazwa akcji" w branchu danej sesji; przy otwarciu programu nowy branch powstaje; cofanie robi reverse do nadpisania; autoskrypt funkcji eksportu klatka po klatce zmian

- publikacja wydania programu wiąże się z postami w socialmediach

- taskfile, husky i standardowy zestaw komend

---

### rodzaje hostów - "WORKSHOP" jest wszędzie, 

- POSTERUNEK MISTRZA: przestrzeń robocza z możliwością zarządzania zdalnego wszystkimi hostami systemu bos w setternecie

- PUNKT KUŹNICZY: przestrzeń robocza do pracy deweloperskiej, kompilacji i innych podobnych prac

- SALA PRÓB: przestrzeń robocza dla wirtualnych maszyn, testowania

- KRAM TARGOWY: tylko publikacyjna przestrzeń robocza, do automatycznych postów na socialmediach i innych akcji tego typu

- MONOLIT KANONU: tylko zdalne archiwum, zapis nadrzędny archiwalny wszystkich projektów, wymaga ciągłości kompletnej, jest jeden taki host w setternecie

- KATAKUMB POBOCZNY: archiwum, dedykowane do konkretnej funkcji, typu publikator, autotester, co-work etc. >> ollama, deploymenty 

---

### foldery w WORKSHOP 
- .BOS - przechowywanie ustawień, klucze, customizacja
- ~~.SETTERNET - determinuje przestrzeń w sieci snet~~ [`NOTE: przeniesiono do "__WORKSHOP/.BOS/setup/setternet/"`]
- FORGE - przestrzeń aktywnej pracy
- ARCHIVE - repozytoria w stanie spoczynku
- DEVARMORY - tu składowane są zestawy narzędzi i aplikacyjne komponenty
- CRAFTBOOKS - drafty, noty i pozostałe podobne rzeczy


### podział modeli

- PROJECT: dostosowane do bycia repozytorium projektowym

- SHEME: oporządzanie dróg przetwarzania delegowań (hf uploaders, publish routines, deploy automation i inne takie)

- THROWBOX: zautomatyzowane zbieranie zbiorów plików różnych, powiązanych z konkretnym zbiorem projektowym

- SUPERPROJECT: kolekcja tematycznych projektów, shematów i wspólnego dla nich throwboxa, ze wspólnymi

- FORGE: przestrzeń robocza, odpowiednik biórka, tylko otwarte projekty w trakcie aktywnego opracowywania, zawiera superprojekty i okresowy throwbox, definiuje brancha roboczego

- SCRAPBOOK: zsynchronizowany notes, sychronizuje notatki z projektów, schematów i throwboxów

- ARCHIVE: zapis skompresowanych superprojektów w formie pojedynczych składowych, zawiera pełen zapis historii wstecz w postaci zapisu zmian svn

- WORKSHOP: instancja bos zamknięta w jednym folderze, definiuje rolę w systemie wielohostowym, każdy host ma swój WORKSHOP

---

### delegowanie uniwersalnych części do odseparowanych podmodeli
- setternet: bramki łączności
- integratory jako rozszerzenia programów: jako klienty setternet z presetami API
- -- 
- -- thundrebird
- -- chrome
- -- codium 
- -- 
- -- git gitpython octokit husky
- -- GIMP
- -- obs
- -- 
- -- 
- -- 
- integratory jako proceduralne wrappery narzędzi i mosty makr poleceniowych
- -- adb - testsuit, devtooling etc.
- -- flipper zero - cli & devtools
- -- github workflowsy - generator procedur
- -- docker - manager, generator etc.
- -- Arduino - 
- SCRAPBOOK może być skorelowany z Shakespeare'm
