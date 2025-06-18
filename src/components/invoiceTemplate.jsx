import {
  Document, Page, Text, View, StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  buyerHeader: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    paddingBottom: 4,
    marginTop: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #ccc',
    paddingVertical: 3
  },
  cell: {
    flex: 1,
    paddingRight: 4,
  },
  totalAmountSection: {
    marginTop: 12,
    marginRight: 40,
    alignItems: 'flex-end'
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
    marginTop: 2
  }
});
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // month is 0-indexed
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export default function InvoiceTemplate({ buyer, items, invoiceDate, billTotal }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Buyer as Header */}
        <Text style={styles.buyerHeader}>
          {buyer?.name?.toUpperCase() || 'BUYER NAME'}
        </Text>

        {/* Invoice Info */}
        <View style={styles.section}>
          <Text>Invoice Date: {formatDate(invoiceDate)}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Rate</Text>
          <Text style={styles.cell}>Disc%</Text>
          <Text style={styles.cell}>Amount</Text>
        </View>

        {/* Table Rows */}
        {items.map((el, idx) => {
          const total = el.item.rate * el.qty * (1 - (el.discount || 0) / 100)
          return (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.cell}>{el.item.name}</Text>
              <Text style={styles.cell}>₹{el.item.rate}</Text>
              <Text style={styles.cell}>{el.qty}</Text>
              <Text style={styles.cell}>{el.discount || 0}%</Text>
              <Text style={styles.cell}>₹{total.toFixed(2)}</Text>
            </View>
          )
        })}

        {/* Total Section */}
        <View style={styles.totalAmountSection}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>₹{billTotal.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}
