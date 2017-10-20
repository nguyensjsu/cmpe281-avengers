path = 'Transaction.txt'
trans_file = open(path,'r')
trans = trans_file.read()


new_path = 'TransactionNew.txt'
new_trans = open(new_path,'w')

title = 'Transaction Details\n'
new_trans.write(title)
print(title)

new_trans.write(trans)
print(trans)

trans_file.close()
new_trans.close()
