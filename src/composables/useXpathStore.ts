import { ref, computed, onMounted } from "vue";

const RECENT_QUERY_KEY = "recentQuery";
const RECENT_XML_KEY = "recentXml";

const _recentQuery = ref<string>("//ProductID");
const _recentXml =
  ref<string>(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <List>
      <Product>
        <ProductID>HT-2001</ProductID>
        <ProductName>Professional Dry Cleaning Machine</ProductName>
        <ProductPrice>1999.99</ProductPrice>
      </Product>
      <Product>
        <ProductID>HT-1020</ProductID>
        <ProductName>Compact Dry Cleaning Unit</ProductName>
        <ProductPrice>799.50</ProductPrice>
      </Product>
      <Product>
        <ProductID>HT-7000</ProductID>
        <ProductName>Industrial Dry Cleaning System</ProductName>
        <ProductPrice>5499.00</ProductPrice>
      </Product>
    </List>
  </soapenv:Body>
</soapenv:Envelope>`);
const _history = ref<AppXpathStoreItem[]>([]);

export const useXpathStore = () => {
  // Recent XML payload logic
  const recentXml = computed(() => _recentXml.value);
  const setRecentXml = (value: string) => {
    localStorage.setItem(RECENT_XML_KEY, value);
    _recentXml.value = value;
  };

  const initRecentXml = () => {
    if (localStorage.getItem(RECENT_XML_KEY)) {
      setRecentXml(localStorage.getItem(RECENT_XML_KEY) as string);
    }
  };

  // Recent query logic
  const recentQuery = computed(() => _recentQuery.value);
  const setRecentQuery = (value: string) => {
    localStorage.setItem(RECENT_QUERY_KEY, value);
    _recentQuery.value = value;
  };

  const initRecentQuery = () => {
    if (localStorage.getItem(RECENT_QUERY_KEY)) {
      setRecentQuery(localStorage.getItem(RECENT_QUERY_KEY) as string);
    }
  };

  // Queries and results store
  const history = computed(() => _history.value);
  const addToHistory = (item: AppXpathStoreItem) => {
    _history.value.unshift(item);
    localStorage.setItem("xpath-history", JSON.stringify(_history.value));
  };
  const removeFromHistory = (id: string) => {
    _history.value = _history.value.filter((item) => item.id !== id);
    localStorage.setItem("xpath-history", JSON.stringify(_history.value));
  };

  const initHistory = () => {
    if (localStorage.getItem("xpath-history")) {
      _history.value = JSON.parse(
        localStorage.getItem("xpath-history") as string
      );
    }
  };

  onMounted(() => {
    initRecentQuery();
    initRecentXml();
    initHistory();
  });

  return {
    recentXml,
    setRecentXml,
    recentQuery,
    setRecentQuery,
    history,
    addToHistory,
    removeFromHistory
  };
};
