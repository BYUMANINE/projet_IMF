import axios from 'axios'

import dateManager from '../functions/dateManager'
import helper from '../functions/helper'
import highcharts from 'highcharts'
import highchartsGantt from 'highcharts/highcharts-gantt'
import loadingTable from '../components/loading_table'
import linearLoading from '../components/linear_loading'
import nondata from '../components/no_data_found'
import grandTitre from '../components/grand_titre'
import Store from '../functions/store'
import customerAppBar from '../components/customer_app_bar'
import search from '../components/search'
import filterByDate from '../components/filter_by_date'
import labelFilterByDate from '../components/label_filter_by_date'
import menuOption from '../components/menu_option'
import listMenuOptions from '../components/list_menu_options'
import consigne from '../components/consigne'
import searchResult from '../components/search_result'
import inputLabel from '../components/input_label'
import sortTable from '../components/sort_table'
import joindreFichier from '../pages/commun/joindre_fichiers'
import datas from '../functions/datas'
import subMenuOption from '../components/sub_menu_option'
import checkBoxGroup from '../components/checkbox_group'
import myPagination from '../components/my_pagination'
import previewRapportDialog from '../components/previewRapportDialog'

export default ({
  Vue
}) => {
  axios.defaults.headers = {
    'Content-Type': 'application/json',
    'X-ALLOW': 'COMPUTER',
    'X-AUTHORIZATION': 'a57jkdjkgfjkgfe062aa5e4a3062aa5e4a3'
  }

  Vue.prototype.$axios = axios

  Vue.prototype.$dateManager = dateManager
  Vue.prototype.$helper = helper
  Vue.prototype.$highcharts = highcharts
  Vue.prototype.$highchartsGantt = highchartsGantt
  Vue.prototype.$vue = Vue
  Vue.prototype.$store = new Store()
  // A enlever
  Vue.prototype.$datas = datas

  // IMPORTER LES COMPOSANTS
  Vue.component('loadingTable', loadingTable)
  Vue.component('linearLoading', linearLoading)
  Vue.component('nondata', nondata)
  Vue.component('grandTitre', grandTitre)
  Vue.component('customerAppBar', customerAppBar)
  Vue.component('filterByDate', filterByDate)
  Vue.component('labelFilterByDate', labelFilterByDate)
  Vue.component('search', search)
  Vue.component('menuOption', menuOption)
  Vue.component('listMenuOptions', listMenuOptions)
  Vue.component('consigne', consigne)
  Vue.component('searchResult', searchResult)
  Vue.component('inputLabel', inputLabel)
  Vue.component('sortTable', sortTable)
  Vue.component('joindreFichier', joindreFichier)
  Vue.component('subMenuOption', subMenuOption)
  Vue.component('checkBoxGroup', checkBoxGroup)
  Vue.component('myPagination', myPagination)
  Vue.component('previewRapportDialog', previewRapportDialog)
}
