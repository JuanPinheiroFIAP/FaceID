def test_connection_success(db_conn):
    cursor = db_conn.cursor()
    cursor.execute("SELECT 1 FROM dual")
    result = cursor.fetchone()
    assert result[0] == 1
    cursor.close()
