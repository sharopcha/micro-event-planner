import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  body: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 40,
  }, 
  detailsBox: {
    borderTop: '1 solid #ccc',
    borderBottom: '1 solid #ccc',
    paddingVertical: 15,
    width: '100%',
    marginVertical: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 10,
    color: '#666',
    marginRight: 5,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
})

interface InvitationPdfProps {
  event: any
  content: any
}

export function InvitationPdf({ event, content }: InvitationPdfProps) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.headline}>
            {content.headline || event.name}
          </Text>
          
          <Text style={styles.body}>
            {content.body || "You are invited!"}
          </Text>

          <View style={styles.detailsBox}>
             <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>Date:</Text>
               <Text style={styles.detailValue}>{event.date || 'TBD'}</Text>
             </View>
             {event.time && (
               <View style={styles.detailRow}>
                 <Text style={styles.detailLabel}>Time:</Text>
                 <Text style={styles.detailValue}>{event.time}</Text>
               </View>
             )}
             {event.city && (
               <View style={styles.detailRow}>
                 <Text style={styles.detailLabel}>Location:</Text>
                 <Text style={styles.detailValue}>{event.city}</Text>
               </View>
             )}
          </View>

          {content.key_details && (
             <Text style={{ fontSize: 10, marginTop: 10 }}>
               {content.key_details}
             </Text>
          )}

          <Text style={styles.footer}>
            Created with Micro Event Planner
          </Text>
        </View>
      </Page>
    </Document>
  )
}
