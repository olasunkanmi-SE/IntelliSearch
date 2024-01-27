# LangChain-VectorApp

This is a cutting-edge application that harnesses the power of large language models (LLMS), vector databases, and context-aware reasoning applications, to deliver a seamless and intelligent user experience. This innovative project combines advanced natural language processing with efficient vector storage and retrieval, providing a robust foundation for building intelligent applications.

## Technologies Used

- **LangChain**: [Documentation](https://www.langchain.com/)

## YugabyteDB

- Launch a 3-node YugabyteDB cluster of version 2.19.2.0 or later:

mkdir ~/yugabyte_volume

docker network create custom-network

docker run -d --name yugabytedb-node1 --net custom-network \
 -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
 -v ~/yugabyte_volume/node1:/home/yugabyte/yb_data --restart unless-stopped \
 yugabytedb/yugabyte:latest \
 bin/yugabyted start \
 --base_dir=/home/yugabyte/yb_data --daemon=false

docker run -d --name yugabytedb-node2 --net custom-network \
 -p 15434:15433 -p 7002:7000 -p 9002:9000 -p 5434:5433 \
 -v ~/yugabyte_volume/node2:/home/yugabyte/yb_data --restart unless-stopped \
 yugabytedb/yugabyte:latest \
 bin/yugabyted start --join=yugabytedb-node1 \
 --base_dir=/home/yugabyte/yb_data --daemon=false

docker run -d --name yugabytedb-node3 --net custom-network \
 -p 15435:15433 -p 7003:7000 -p 9003:9000 -p 5435:5433 \
 -v ~/yugabyte_volume/node3:/home/yugabyte/yb_data --restart unless-stopped \
 yugabytedb/yugabyte:latest \
 bin/yugabyted start --join=yugabytedb-node1 \
 --base_dir=/home/yugabyte/yb_data --daemon=false
