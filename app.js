(function () {
  "use strict";

  var DATA = window.ESCAPADE_DATA;
  var KEY = "escapade:v1";

  var DEFAULTS = function () {
    return {
      budget: 60,
      duree: 0,
      categorie: "toutes",
      selected: [],
      checked: [],
      custom: [],
      theme: "light"
    };
  };

  // ---------- Stockage local (tolérant aux données invalides) ----------
  function load() {
    var s = DEFAULTS();
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return s;
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return s;
      var ids = DATA.activites.map(function (a) { return a.id; });
      if (typeof o.budget === "number" && o.budget >= 0 && o.budget <= 60) s.budget = o.budget;
      if ([0, 60, 120, 180].indexOf(o.duree) !== -1) s.duree = o.duree;
      if (o.categorie === "toutes" || DATA.categories[o.categorie]) s.categorie = o.categorie;
      if (Array.isArray(o.selected)) s.selected = o.selected.filter(function (id, i, a) { return ids.indexOf(id) !== -1 && a.indexOf(id) === i; });
      if (Array.isArray(o.custom)) s.custom = o.custom.filter(function (t) { return typeof t === "string" && t.trim(); }).slice(0, 30);
      if (Array.isArray(o.checked)) s.checked = o.checked.filter(function (t) { return typeof t === "string"; });
      if (o.theme === "dark") s.theme = "dark";
    } catch (e) { /* données invalides : on repart des valeurs par défaut */ }
    return s;
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* stockage indisponible */ }
  }

  var state = load();

  // ---------- Éléments ----------
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    budget: $("budget"), budgetOut: $("budget-out"), duree: $("duree"), categorie: $("categorie"),
    hasard: $("hasard"), cartes: $("cartes"), vide: $("vide"), compteur: $("compteur"),
    assouplir: $("assouplir"), programme: $("programme"), programmeVide: $("programme-vide"),
    totalDuree: $("total-duree"), totalCout: $("total-cout"), checklist: $("checklist"),
    ajout: $("ajout-item"), nouvel: $("nouvel-item"), reset: $("reset"), theme: $("theme-toggle")
  };

  // ---------- Utilitaires ----------
  function fmtDuree(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return m ? h + " h " + (m < 10 ? "0" + m : m) : h + " h";
  }
  function fmtCout(c) { return c === 0 ? "Gratuit" : c + " €"; }
  function byId(id) { return DATA.activites.filter(function (a) { return a.id === id; })[0]; }

  function visibles() {
    return DATA.activites.filter(function (a) {
      if (a.cout > state.budget) return false;
      if (state.duree > 0 && a.duree > state.duree) return false;
      if (state.categorie !== "toutes" && a.categorie !== state.categorie) return false;
      return true;
    });
  }

  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ---------- Rendu : cartes ----------
  function renderCartes(highlightId) {
    var list = visibles();
    el.cartes.textContent = "";
    el.vide.hidden = list.length > 0;
    el.compteur.textContent = list.length === 0 ? "Aucun résultat."
      : list.length + (list.length > 1 ? " activités correspondent" : " activité correspond") + " à vos critères.";

    list.forEach(function (a) {
      var sel = state.selected.indexOf(a.id) !== -1;
      var card = make("article", "card" + (sel ? " is-selected" : "") + (a.id === highlightId ? " is-highlight" : ""));
      card.dataset.id = a.id;

      var vis = make("div", "card__visual");
      vis.style.background = "repeating-linear-gradient(135deg," + a.motif + "," + a.motif + " 14px,rgba(255,255,255,.35) 14px,rgba(255,255,255,.35) 28px)";
      vis.setAttribute("aria-hidden", "true");
      vis.textContent = a.icone;

      var body = make("div", "card__body");
      body.appendChild(make("span", "tag", DATA.categories[a.categorie]));
      body.appendChild(make("h3", null, a.titre));
      body.appendChild(make("p", null, a.description));
      var meta = make("div", "meta");
      meta.appendChild(make("span", null, "⏱ " + fmtDuree(a.duree)));
      meta.appendChild(make("span", null, "€ " + fmtCout(a.cout)));
      body.appendChild(meta);
      body.appendChild(make("span", "badge", "✔ Dans mon programme"));

      var btn = make("button", "btn", sel ? "Retirer du programme" : "Ajouter au programme");
      btn.type = "button";
      btn.setAttribute("aria-pressed", sel ? "true" : "false");
      btn.setAttribute("aria-label", (sel ? "Retirer « " : "Ajouter « ") + a.titre + (sel ? " » du programme" : " » au programme"));
      btn.addEventListener("click", function () { toggle(a.id); });
      body.appendChild(btn);

      card.appendChild(vis);
      card.appendChild(body);
      el.cartes.appendChild(card);
    });
  }

  // ---------- Rendu : programme ----------
  function renderProgramme() {
    el.programme.textContent = "";
    var duree = 0, cout = 0;
    state.selected.forEach(function (id) {
      var a = byId(id);
      if (!a) return;
      duree += a.duree; cout += a.cout;
      var li = make("li");
      li.appendChild(make("span", null, a.titre + " — " + fmtDuree(a.duree) + ", " + fmtCout(a.cout)));
      var b = make("button", null, "Retirer");
      b.type = "button";
      b.setAttribute("aria-label", "Retirer « " + a.titre + " » du programme");
      b.addEventListener("click", function () { toggle(id); });
      li.appendChild(b);
      el.programme.appendChild(li);
    });
    el.programmeVide.hidden = state.selected.length > 0;
    el.totalDuree.textContent = fmtDuree(duree);
    el.totalCout.textContent = cout + " €";
  }

  // ---------- Rendu : checklist ----------
  function renderChecklist() {
    el.checklist.textContent = "";
    var items = DATA.checklist.map(function (t) { return { t: t, custom: false }; })
      .concat(state.custom.map(function (t) { return { t: t, custom: true }; }));
    items.forEach(function (it, i) {
      var li = make("li");
      var label = make("label");
      var cb = make("input");
      cb.type = "checkbox";
      cb.id = "chk-" + i;
      cb.checked = state.checked.indexOf(it.t) !== -1;
      cb.addEventListener("change", function () {
        state.checked = state.checked.filter(function (x) { return x !== it.t; });
        if (cb.checked) state.checked.push(it.t);
        save();
      });
      label.appendChild(cb);
      label.appendChild(make("span", null, it.t));
      li.appendChild(label);
      if (it.custom) {
        var del = make("button", null, "Supprimer");
        del.type = "button";
        del.setAttribute("aria-label", "Supprimer « " + it.t + " » de la checklist");
        del.addEventListener("click", function () {
          state.custom = state.custom.filter(function (x) { return x !== it.t; });
          state.checked = state.checked.filter(function (x) { return x !== it.t; });
          save(); renderChecklist();
        });
        li.appendChild(del);
      }
      el.checklist.appendChild(li);
    });
  }

  // ---------- Actions ----------
  function toggle(id) {
    var i = state.selected.indexOf(id);
    if (i === -1) state.selected.push(id); else state.selected.splice(i, 1);
    save(); renderCartes(); renderProgramme();
  }

  function syncControls() {
    el.budget.value = state.budget;
    el.budgetOut.textContent = state.budget === 0 ? "gratuit" : state.budget + " €";
    el.duree.value = String(state.duree);
    el.categorie.value = state.categorie;
  }

  function applyTheme() {
    if (state.theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    el.theme.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
    el.theme.textContent = "Mode sombre : " + (state.theme === "dark" ? "activé" : "désactivé");
  }

  function resetCriteres() {
    var d = DEFAULTS();
    state.budget = d.budget; state.duree = d.duree; state.categorie = d.categorie;
    save(); syncControls(); renderCartes();
  }

  // ---------- Initialisation ----------
  Object.keys(DATA.categories).forEach(function (k) {
    var o = make("option", null, DATA.categories[k]);
    o.value = k;
    el.categorie.appendChild(o);
  });

  el.budget.addEventListener("input", function () {
    state.budget = Number(el.budget.value);
    el.budgetOut.textContent = state.budget === 0 ? "gratuit" : state.budget + " €";
    save(); renderCartes();
  });
  el.duree.addEventListener("change", function () { state.duree = Number(el.duree.value); save(); renderCartes(); });
  el.categorie.addEventListener("change", function () { state.categorie = el.categorie.value; save(); renderCartes(); });
  el.assouplir.addEventListener("click", resetCriteres);
  $("filtres").addEventListener("submit", function (e) { e.preventDefault(); });

  el.hasard.addEventListener("click", function () {
    var list = visibles();
    if (!list.length) { el.compteur.textContent = "Aucune activité à choisir : modifiez vos critères."; return; }
    var pick = list[Math.floor(Math.random() * list.length)];
    if (state.selected.indexOf(pick.id) === -1) state.selected.push(pick.id);
    save(); renderCartes(pick.id); renderProgramme();
    el.compteur.textContent = "Choisi pour vous : " + pick.titre + ".";
    var c = el.cartes.querySelector(".is-highlight");
    if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest" });
  });

  el.ajout.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = el.nouvel.value.trim();
    var all = DATA.checklist.concat(state.custom);
    if (!t || all.indexOf(t) !== -1) { el.nouvel.value = ""; return; }
    state.custom.push(t);
    el.nouvel.value = "";
    save(); renderChecklist();
  });

  el.reset.addEventListener("click", function () {
    if (typeof window.confirm === "function" && !window.confirm("Effacer vos critères, votre programme et votre checklist ?")) return;
    try { window.localStorage.removeItem(KEY); } catch (e) { /* ignoré */ }
    state = DEFAULTS();
    applyTheme(); syncControls(); renderCartes(); renderProgramme(); renderChecklist();
  });

  el.theme.addEventListener("click", function () {
    state.theme = state.theme === "dark" ? "light" : "dark";
    save(); applyTheme();
  });

  applyTheme(); syncControls(); renderCartes(); renderProgramme(); renderChecklist();

  // Exposé pour les tests manuels / automatiques
  window.__escapade = { visibles: visibles, state: function () { return state; } };
})();
